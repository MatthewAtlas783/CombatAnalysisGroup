import { EventEmitter } from 'node:events';
import { findPluginDataDir, pickAccount, accountScopePath } from './paths.js';
import { readPluginData, watchPluginData, writePluginData } from './plugindata.js';
import { RelayClient, type RelayStatus } from './relay.js';
import type {
  EncounterSummary,
  MobBreakdown,
  PlayerSnapshot,
  ServerMessage,
} from './protocol.js';
import { getSettings, type Settings } from './settings.js';

export type Player = PlayerSnapshot;

export type AppState = {
  relayStatus: RelayStatus;
  relayDetail: string | undefined;
  reconnectAt: number | undefined;
  joined: boolean;
  room: string;
  player: string;
  inputPath: string | undefined;
  outputPath: string | undefined;
  account: string | undefined;
  local:
    | { amount: number; duration: number; attacks: number; updatedAt: number; inCombat: boolean }
    | undefined;
  players: Record<string, Player>;
  roomInCombat: boolean;
  currentEncounter: EncounterSummary | undefined;
  history: EncounterSummary[];
  selectedEncounterId: number | undefined;
  bootError: string | undefined;
};

const LOCAL_KEY = 'CALocalStats';
const GROUP_KEY = 'CAGroupData';
const DETAIL_KEY = 'CAEncounterDetail';
// Heartbeat: floor on how often we re-send local stats even when nothing
// changed. Real updates are pushed event-driven from the chokidar watcher,
// so this is only the keep-alive for stale-but-still-here state.
const SEND_HEARTBEAT_MS = 2_000;
// Min gap between two pushes triggered by file events — protects relay from
// chokidar "double-fire" on atomic rename + content change without delaying
// real updates (50ms is well below human-perceptible latency).
const SEND_MIN_GAP_MS = 50;
// Local mirror: if the relay drops a player from the snapshot (relay restart,
// network glitch) keep them visible to the user for this long with offline=true.
// Relay-side grace is 3min; this is a slightly shorter safety net so we don't
// keep ghosts indefinitely if a player legitimately leaves.
const PEER_CACHE_TTL_MS = 2 * 60 * 1000;

function defaultState(): AppState {
  return {
    relayStatus: 'idle',
    relayDetail: undefined,
    reconnectAt: undefined,
    joined: false,
    room: '',
    player: '',
    inputPath: undefined,
    outputPath: undefined,
    account: undefined,
    local: undefined,
    players: {},
    roomInCombat: false,
    currentEncounter: undefined,
    history: [],
    selectedEncounterId: undefined,
    bootError: undefined,
  };
}

export class Service extends EventEmitter {
  private state: AppState = defaultState();
  private relay: RelayClient | undefined;
  private stopWatch: (() => void) | undefined;
  private stopDetailWatch: (() => void) | undefined;
  private heartbeatTimer: NodeJS.Timeout | undefined;
  private lastSentAt = 0;
  // Per-player highest `seq` we've already forwarded to the relay — guards
  // against chokidar re-firing (e.g. on atomic-rename) replaying the same
  // snapshot and burning relay cycles / bumping timestamps.
  private lastForwardedDetailSeq = new Map<string, number>();
  // Local mirror of peers we've seen. Survives relay drops via TTL so an
  // unstable relay or a peer logging off doesn't yank rows out of the UI.
  private peerCache = new Map<string, { snap: PlayerSnapshot; cachedAt: number }>();

  start(): void {
    this.restartFromSettings();
  }

  getState(): AppState {
    return this.state;
  }

  reconnect(): void {
    this.restartFromSettings();
  }

  applySettings(): void {
    this.restartFromSettings();
  }

  selectEncounter(id: number | undefined): void {
    this.patch({ selectedEncounterId: id });
  }

  shutdown(): void {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = undefined;
    if (this.stopWatch) this.stopWatch();
    this.stopWatch = undefined;
    if (this.stopDetailWatch) this.stopDetailWatch();
    this.stopDetailWatch = undefined;
    if (this.relay) this.relay.close();
    this.relay = undefined;
    this.peerCache.clear();
    this.lastForwardedDetailSeq.clear();
  }

  private restartFromSettings(): void {
    this.shutdown();
    this.patch(defaultState());

    const settings: Settings = getSettings();
    let pluginDataDir: string;
    let account: string;
    let inputPath: string;
    let outputPath: string;
    let detailPath: string;
    try {
      pluginDataDir = findPluginDataDir(settings.pluginDataDir || undefined);
      account = pickAccount(pluginDataDir, settings.account || undefined);
      inputPath = accountScopePath(pluginDataDir, account, LOCAL_KEY);
      outputPath = accountScopePath(pluginDataDir, account, GROUP_KEY);
      detailPath = accountScopePath(pluginDataDir, account, DETAIL_KEY);
    } catch (err) {
      this.patch({
        bootError: err instanceof Error ? err.message : String(err),
        room: settings.room,
        player: settings.playerOverride,
      });
      return;
    }

    this.patch({
      room: settings.room,
      player: settings.playerOverride,
      inputPath,
      outputPath,
      account,
    });

    this.relay = new RelayClient(settings.relayUrl, {
      onStatus: (status, info) => {
        const reconnectAt = info?.reconnectInMs ? Date.now() + info.reconnectInMs : undefined;
        this.patch({
          relayStatus: status,
          relayDetail: info?.error,
          reconnectAt,
          joined: status === 'connected' ? this.state.joined : false,
        });
        if (status === 'connected' && this.state.player && this.relay) {
          this.relay.send({ type: 'join', room: settings.room, player: this.state.player });
        }
      },
      onMessage: (msg: ServerMessage) => {
        if (msg.type === 'joined') {
          this.patch({ joined: true, room: msg.room });
        } else if (msg.type === 'snapshot') {
          const merged = this.mergePeerCache(msg.players);
          this.patch({
            players: merged,
            roomInCombat: msg.roomInCombat,
            currentEncounter: msg.current,
            history: msg.history,
          });
          try {
            writePluginData(outputPath, buildPluginPayload(msg, merged));
          } catch {
            /* swallow — surfaced via state on next attempt */
          }
        }
      },
    });

    this.stopWatch = watchPluginData(inputPath, (data, error) => {
      if (error) return;
      const snap = asLocalSnapshot(data, this.state.player || settings.playerOverride);
      if (!snap) return;
      // Character swap: previously tracked player differs from the one the
      // plugin is now reporting. Evict old state and re-join the relay as
      // the new character so the old parse doesn't linger.
      const prev = this.state.player;
      if (prev && prev !== snap.player) {
        this.peerCache.clear();
        this.patch({
          player: snap.player,
          local: {
            amount: snap.amount,
            duration: snap.duration,
            attacks: snap.attacks,
            inCombat: snap.inCombat,
            updatedAt: Date.now(),
          },
          players: {},
          currentEncounter: undefined,
          history: [],
          selectedEncounterId: undefined,
          joined: false,
        });
        if (this.state.relayStatus === 'connected' && this.relay) {
          this.relay.send({ type: 'join', room: settings.room, player: snap.player });
        }
        return;
      }
      this.patch({
        player: snap.player,
        local: {
          amount: snap.amount,
          duration: snap.duration,
          attacks: snap.attacks,
          inCombat: snap.inCombat,
          updatedAt: Date.now(),
        },
      });
      if (!this.state.joined && this.state.relayStatus === 'connected' && this.relay) {
        this.relay.send({ type: 'join', room: settings.room, player: snap.player });
      }
      // Push new local stats to the relay immediately rather than waiting on
      // the heartbeat tick — cuts ~250ms off the end-to-end lag.
      this.pushLocalStats();
    });

    try {
      const initial = readPluginData(inputPath);
      const snap = asLocalSnapshot(initial, settings.playerOverride);
      if (snap) {
        this.patch({
          player: snap.player,
          local: {
            amount: snap.amount,
            duration: snap.duration,
            attacks: snap.attacks,
            inCombat: snap.inCombat,
            updatedAt: Date.now(),
          },
        });
      }
    } catch {
      /* ignore — initial may not exist */
    }

    this.stopDetailWatch = watchPluginData(detailPath, (data, error) => {
      if (error) return;
      const detail = asEncounterDetail(data);
      if (!detail) return;
      // Plugin writes this once per COMBAT_END. chokidar may still fire twice
      // on atomic rename; guard by `seq` so we only forward new snapshots.
      const last = this.lastForwardedDetailSeq.get(detail.player) ?? 0;
      if (detail.seq <= last) return;
      this.lastForwardedDetailSeq.set(detail.player, detail.seq);
      if (this.relay) {
        this.relay.send({
          type: 'encounterDetail',
          player: detail.player,
          seq: detail.seq,
          duration: detail.duration,
          total: detail.total,
          attacks: detail.attacks,
          mobs: detail.mobs,
        });
      }
    });

    this.heartbeatTimer = setInterval(() => this.pushLocalStats(), SEND_HEARTBEAT_MS);

    this.relay.connect();
  }

  private pushLocalStats(): void {
    if (!this.relay) return;
    const local = this.state.local;
    const player = this.state.player;
    if (!local || !player) return;
    const now = Date.now();
    if (now - this.lastSentAt < SEND_MIN_GAP_MS) return;
    this.lastSentAt = now;
    this.relay.send({
      type: 'stats',
      player,
      amount: local.amount,
      duration: local.duration,
      attacks: local.attacks,
      inCombat: local.inCombat,
    });
  }

  /**
   * Merge the relay's broadcast `players` with our local cache. Any player in
   * the broadcast becomes the source of truth; any cached peer NOT in the
   * broadcast is held with online=false until their cache TTL expires. This
   * survives a relay restart or a peer logoff so rows don't blink out.
   */
  private mergePeerCache(fresh: Record<string, PlayerSnapshot>): Record<string, PlayerSnapshot> {
    const now = Date.now();
    const out: Record<string, PlayerSnapshot> = {};
    for (const [name, snap] of Object.entries(fresh)) {
      out[name] = snap;
      this.peerCache.set(name, { snap, cachedAt: now });
    }
    for (const [name, entry] of this.peerCache) {
      if (out[name]) continue;
      if (now - entry.cachedAt > PEER_CACHE_TTL_MS) {
        this.peerCache.delete(name);
        continue;
      }
      out[name] = { ...entry.snap, online: false, inCombat: false };
    }
    return out;
  }

  private patch(p: Partial<AppState>): void {
    this.state = { ...this.state, ...p };
    this.emit('state', this.state);
  }
}

type LocalSnapshot = {
  player: string;
  amount: number;
  duration: number;
  attacks: number;
  inCombat: boolean;
};

type EncounterDetailPayload = {
  player: string;
  seq: number;
  duration: number;
  total: number;
  attacks: number;
  mobs: MobBreakdown[];
};

function asEncounterDetail(raw: unknown): EncounterDetailPayload | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const r = raw as Record<string, unknown>;
  if (typeof r.player !== 'string' || typeof r.seq !== 'number') return undefined;
  if (!Array.isArray(r.mobs)) return undefined;
  const mobs: MobBreakdown[] = [];
  for (const m of r.mobs) {
    if (!m || typeof m !== 'object') continue;
    const mo = m as Record<string, unknown>;
    if (typeof mo.name !== 'string') continue;
    const skillsIn = (mo.skills && typeof mo.skills === 'object') ? (mo.skills as Record<string, unknown>) : {};
    const skills: MobBreakdown['skills'] = {};
    for (const [skillName, v] of Object.entries(skillsIn)) {
      if (!v || typeof v !== 'object') continue;
      const sv = v as Record<string, unknown>;
      skills[skillName] = {
        amount: typeof sv.amount === 'number' ? sv.amount : 0,
        attacks: typeof sv.attacks === 'number' ? sv.attacks : 0,
        max: typeof sv.max === 'number' ? sv.max : 0,
        min: typeof sv.min === 'number' ? sv.min : 0,
        crits: typeof sv.crits === 'number' ? sv.crits : 0,
        devs: typeof sv.devs === 'number' ? sv.devs : 0,
      };
    }
    mobs.push({
      name: mo.name,
      duration: typeof mo.duration === 'number' ? mo.duration : 0,
      total: typeof mo.total === 'number' ? mo.total : 0,
      attacks: typeof mo.attacks === 'number' ? mo.attacks : 0,
      skills,
    });
  }
  return {
    player: r.player,
    seq: r.seq,
    duration: typeof r.duration === 'number' ? r.duration : 0,
    total: typeof r.total === 'number' ? r.total : 0,
    attacks: typeof r.attacks === 'number' ? r.attacks : 0,
    mobs,
  };
}

function asLocalSnapshot(raw: unknown, fallbackPlayer: string | undefined): LocalSnapshot | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const r = raw as Record<string, unknown>;
  const player = (typeof r.player === 'string' && r.player) || fallbackPlayer;
  const amount = typeof r.amount === 'number' ? r.amount : undefined;
  const duration = typeof r.duration === 'number' ? r.duration : 0;
  const attacks = typeof r.attacks === 'number' ? r.attacks : 0;
  const inCombat = typeof r.inCombat === 'boolean' ? r.inCombat : false;
  if (!player || amount === undefined) return undefined;
  return { player, amount, duration, attacks, inCombat };
}

function buildPluginPayload(
  msg: Extract<ServerMessage, { type: 'snapshot' }>,
  mergedPlayers: Record<string, PlayerSnapshot>,
): Record<string, unknown> {
  // Live `players` map kept for backward compat with plugin's BuildGroupData
  // (reads raw.players). Prefer current encounter's per-player amounts when
  // a room encounter is active; otherwise fall back to merged cumulative
  // (which includes cached offline peers via the desktop's local mirror).
  const playersOut: Record<string, number> = {};
  if (msg.current) {
    for (const [name, p] of Object.entries(msg.current.players)) {
      playersOut[name] = p.amount;
    }
  } else {
    for (const [name, p] of Object.entries(mergedPlayers)) {
      playersOut[name] = p.amount;
    }
  }
  return {
    players: playersOut,
    playersFull: mergedPlayers,
    roomInCombat: msg.roomInCombat,
    current: msg.current ?? null,
    history: msg.history,
    updatedAt: Date.now(),
  };
}
