import { EventEmitter } from 'node:events';
import { findPluginDataDir, pickAccount, accountScopePath } from './paths.js';
import { readPluginData, watchPluginData, writePluginData } from './plugindata.js';
import { RelayClient, type RelayStatus } from './relay.js';
import type {
  EncounterSummary,
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
  private heartbeatTimer: NodeJS.Timeout | undefined;
  private lastSentAt = 0;
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
    if (this.relay) this.relay.close();
    this.relay = undefined;
    this.peerCache.clear();
  }

  private restartFromSettings(): void {
    this.shutdown();
    this.patch(defaultState());

    const settings: Settings = getSettings();
    let pluginDataDir: string;
    let account: string;
    let inputPath: string;
    let outputPath: string;
    try {
      pluginDataDir = findPluginDataDir(settings.pluginDataDir || undefined);
      account = pickAccount(pluginDataDir, settings.account || undefined);
      inputPath = accountScopePath(pluginDataDir, account, LOCAL_KEY);
      outputPath = accountScopePath(pluginDataDir, account, GROUP_KEY);
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
