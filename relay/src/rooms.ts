import type { WebSocket } from 'ws';
import type {
  EncounterPlayer,
  EncounterSummary,
  MobBreakdown,
  PlayerSnapshot,
  ServerMessage,
} from './protocol.js';

type Member = {
  socket: WebSocket;
  player: string;
};

type PlayerBaseline = {
  amount: number;
  duration: number;
  attacks: number;
  lastReportedAmount: number;
};

export type Room = {
  name: string;
  members: Set<Member>;
  players: Map<string, PlayerSnapshot>;
  baselines: Map<string, PlayerBaseline>;
  current: EncounterSummary | undefined;
  history: EncounterSummary[];
  nextEncounterId: number;
  idleCloseTimer: NodeJS.Timeout | undefined;
  lastBroadcast: number;
  pendingTimer: NodeJS.Timeout | undefined;
  // Per-player offline-eviction timers (3-min grace after disconnect).
  offlineTimers: Map<string, NodeJS.Timeout>;
};

const PLAYER_TTL_MS = 5 * 60 * 1000;
const OFFLINE_GRACE_MS = 3 * 60 * 1000;
const BROADCAST_MIN_INTERVAL_MS = 100;
const ENCOUNTER_IDLE_CLOSE_MS = 5_000;
const HISTORY_LIMIT = 30;

export class RoomRegistry {
  private rooms = new Map<string, Room>();
  private membership = new Map<WebSocket, { member: Member; room: Room }>();

  /**
   * Attach a socket to a room under `player`. Handles three cases:
   *   - fresh socket joining a fresh name → normal add
   *   - same socket re-joining under SAME name (e.g. reconnect after grace) → cancel offline TTL, mark online
   *   - same socket re-joining under DIFFERENT name (character swap) → evict old name immediately, then add new
   */
  join(socket: WebSocket, roomName: string, player: string): Room {
    const prior = this.membership.get(socket);
    if (prior && prior.member.player !== player) {
      // Character swap on the same socket — explicit eviction so the old
      // character's cumulative damage doesn't linger in room.players.
      this.evictPlayer(prior.room, prior.member.player);
      prior.room.members.delete(prior.member);
      this.membership.delete(socket);
    } else if (prior && prior.member.player === player) {
      // Same socket, same name → idempotent rejoin. Just refresh online state.
      this.markOnline(prior.room, player);
      return prior.room;
    }

    let room = this.rooms.get(roomName);
    if (!room) {
      room = {
        name: roomName,
        members: new Set(),
        players: new Map(),
        baselines: new Map(),
        current: undefined,
        history: [],
        nextEncounterId: 1,
        idleCloseTimer: undefined,
        lastBroadcast: 0,
        pendingTimer: undefined,
        offlineTimers: new Map(),
      };
      this.rooms.set(roomName, room);
    }
    const member: Member = { socket, player };
    room.members.add(member);
    this.membership.set(socket, { member, room });
    // Reconnect-while-stats-still-cached: clear any pending offline TTL and
    // mark online so other peers see them light up immediately.
    this.markOnline(room, player);
    this.scheduleBroadcast(room);
    return room;
  }

  /**
   * Explicit leave (client sent {type:'leave'}). Immediately evicts the
   * player from room state — no grace period. This is intentional: the
   * client is telling us "I'm done, drop me."
   */
  leave(socket: WebSocket): void {
    const entry = this.membership.get(socket);
    if (!entry) return;
    entry.room.members.delete(entry.member);
    this.membership.delete(socket);
    this.evictPlayer(entry.room, entry.member.player);
    this.cleanupRoomIfEmpty(entry.room);
  }

  /**
   * Socket dropped (network blip, app close, crash). Mark the player offline
   * and start a 3-minute TTL — keeps their last-known stats visible to peers
   * during the grace window so logoffs don't yank rows out from under them.
   * If they reconnect within the window, join() cancels the TTL.
   */
  markOffline(socket: WebSocket): void {
    const entry = this.membership.get(socket);
    if (!entry) return;
    entry.room.members.delete(entry.member);
    this.membership.delete(socket);

    const room = entry.room;
    const player = entry.member.player;
    const snap = room.players.get(player);
    if (snap) {
      snap.online = false;
      snap.updatedAt = Date.now();
    }

    // Replace any existing TTL so a flapping client still gets a fresh window.
    const existing = room.offlineTimers.get(player);
    if (existing) clearTimeout(existing);
    const timer = setTimeout(() => {
      room.offlineTimers.delete(player);
      // Only evict if they're still offline — a reconnect would have cleared
      // this timer via markOnline(), so seeing it fire means no reconnect.
      const stillOffline = !room.players.get(player)?.online;
      if (stillOffline) {
        this.evictPlayer(room, player);
        this.scheduleBroadcast(room);
        this.cleanupRoomIfEmpty(room);
      }
    }, OFFLINE_GRACE_MS);
    room.offlineTimers.set(player, timer);
    // Player who just went offline may have been the last one still in combat.
    // Re-evaluate the idle close timer so the room encounter closes cleanly
    // instead of waiting the full 3-min offline grace.
    this.refreshIdleTimer(room);
    this.scheduleBroadcast(room);
  }

  recordStats(
    socket: WebSocket,
    player: string,
    amount: number,
    duration: number,
    attacks: number,
    inCombat: boolean,
  ): Room | undefined {
    const entry = this.membership.get(socket);
    if (!entry) return undefined;
    const room = entry.room;
    this.pruneExpired(room);

    const now = Date.now();
    // Snapshot baselines from previous room state BEFORE overwriting the
    // player's stored snapshot — otherwise a player whose very first message
    // triggers the encounter would have their baseline set to their own
    // freshly-reported amount, zeroing their first contribution.
    if (inCombat && !room.current) {
      this.startEncounter(room, now);
    }

    const prev = room.players.get(player);
    room.players.set(player, {
      amount,
      duration,
      attacks,
      updatedAt: now,
      inCombat,
      online: true,
    });
    // Stats arriving means they're alive — clear any offline TTL.
    if (prev && !prev.online) this.markOnline(room, player);

    if (room.current) {
      this.updateEncounterPlayer(room, player, amount, duration, attacks);
    }

    this.refreshIdleTimer(room);
    this.scheduleBroadcast(room);
    return room;
  }

  /**
   * Merge a per-mob/per-skill breakdown from one player into the encounter the
   * plugin just finished. Matching order:
   *   1. Room's current encounter if this player has an entry in it
   *      (e.g. others are still fighting so the encounter hasn't idle-closed)
   *   2. Most-recent history entry containing this player
   * `seq` is a plugin-local monotonic counter; we store it on the entry so a
   * re-delivered snapshot doesn't overwrite a newer one from the same player.
   */
  recordEncounterDetail(
    socket: WebSocket,
    player: string,
    seq: number,
    mobs: MobBreakdown[],
  ): Room | undefined {
    const entry = this.membership.get(socket);
    if (!entry) return undefined;
    const room = entry.room;

    let target: EncounterPlayer | undefined;
    if (room.current && room.current.players[player]) {
      target = room.current.players[player];
    } else {
      for (const enc of room.history) {
        if (enc.players[player]) {
          target = enc.players[player];
          break;
        }
      }
    }
    if (!target) return room;
    // Idempotency: ignore stale snapshots if a newer one already landed.
    if (typeof target.detailSeq === 'number' && target.detailSeq >= seq) return room;

    target.mobs = mobs;
    target.detailSeq = seq;

    this.scheduleBroadcast(room);
    return room;
  }

  snapshot(room: Room): ServerMessage {
    this.pruneExpired(room);
    const players: Record<string, PlayerSnapshot> = {};
    for (const [name, data] of room.players) players[name] = data;
    return {
      type: 'snapshot',
      players,
      roomInCombat: this.isRoomInCombat(room),
      current: room.current ? cloneEncounter(room.current) : undefined,
      history: room.history.map(cloneEncounter),
    };
  }

  stats() {
    return {
      rooms: this.rooms.size,
      sockets: this.membership.size,
    };
  }

  private isRoomInCombat(room: Room): boolean {
    if (!room.current) return false;
    // Only count *online* fighters — an offline socket can't tell us they left
    // combat, so stale inCombat=true would pin the room open for their full
    // 3-min TTL and keep the current-encounter accumulating across real fights.
    for (const p of room.players.values()) if (p.online && p.inCombat) return true;
    return false;
  }

  private startEncounter(room: Room, now: number): void {
    room.current = {
      id: room.nextEncounterId++,
      startedAt: now,
      endedAt: undefined,
      players: {},
    };
    // Seed baselines from last-seen cumulative per player. Per-encounter
    // damage is (reported - baseline), clamped >= 0.
    room.baselines.clear();
    for (const [name, snap] of room.players) {
      room.baselines.set(name, {
        amount: snap.amount,
        duration: snap.duration,
        attacks: snap.attacks,
        lastReportedAmount: snap.amount,
      });
    }
  }

  private updateEncounterPlayer(
    room: Room,
    player: string,
    reportedAmount: number,
    reportedDuration: number,
    reportedAttacks: number,
  ): void {
    if (!room.current) return;
    let baseline = room.baselines.get(player);
    if (!baseline) {
      // Mid-encounter join: this player's first stats arrived AFTER the
      // encounter was already open. Without a baseline, delta would be the
      // player's full plugin-cumulative (often billions). Anchor baseline to
      // the reported values so first delta = 0 and subsequent damage counts
      // from this point onward.
      baseline = {
        amount: reportedAmount,
        duration: reportedDuration,
        attacks: reportedAttacks,
        lastReportedAmount: reportedAmount,
      };
      room.baselines.set(player, baseline);
    }
    // Plugin reset (new local encounter) — reported drops below last seen.
    // Re-anchor baseline to 0 so subsequent growth counts fully.
    if (reportedAmount < baseline.lastReportedAmount) {
      baseline.amount = 0;
      baseline.duration = 0;
      baseline.attacks = 0;
    }
    baseline.lastReportedAmount = reportedAmount;

    const amount = Math.max(0, reportedAmount - baseline.amount);
    const duration = Math.max(0, reportedDuration - baseline.duration);
    const attacks = Math.max(0, reportedAttacks - baseline.attacks);
    const entry: EncounterPlayer = { amount, duration, attacks };
    room.current.players[player] = entry;
  }

  private refreshIdleTimer(room: Room): void {
    if (!room.current) return;
    const inCombat = this.isRoomInCombat(room);
    if (inCombat) {
      // Someone re-entered combat — cancel any pending close.
      if (room.idleCloseTimer) {
        clearTimeout(room.idleCloseTimer);
        room.idleCloseTimer = undefined;
      }
      return;
    }
    // Everyone OOC. Arm the close timer ONCE. Do NOT reset it on every
    // subsequent OOC heartbeat — desktop heartbeats every 2s even when idle,
    // so clear+reset would mean the 5s timer never fires and encounters
    // accumulate forever (we saw this produce 30+ minute "Live encounters"
    // with DPS collapsed across multiple real fights).
    if (room.idleCloseTimer) return;
    room.idleCloseTimer = setTimeout(
      () => this.closeEncounter(room),
      ENCOUNTER_IDLE_CLOSE_MS,
    );
  }

  private closeEncounter(room: Room): void {
    if (!room.current) return;
    room.current.endedAt = Date.now();
    room.history.unshift(room.current);
    if (room.history.length > HISTORY_LIMIT) {
      room.history.length = HISTORY_LIMIT;
    }
    room.current = undefined;
    room.baselines.clear();
    room.idleCloseTimer = undefined;
    this.scheduleBroadcast(room);
  }

  private pruneExpired(room: Room): void {
    const cutoff = Date.now() - PLAYER_TTL_MS;
    for (const [name, data] of room.players) {
      // Don't TTL out players who are within the offline grace window — that
      // path has its own (shorter) timer and is the authoritative cleanup.
      if (data.online && data.updatedAt < cutoff) {
        this.evictPlayer(room, name);
      }
    }
  }

  private evictPlayer(room: Room, player: string): void {
    room.players.delete(player);
    room.baselines.delete(player);
    if (room.current) delete room.current.players[player];
    const t = room.offlineTimers.get(player);
    if (t) {
      clearTimeout(t);
      room.offlineTimers.delete(player);
    }
  }

  private markOnline(room: Room, player: string): void {
    const t = room.offlineTimers.get(player);
    if (t) {
      clearTimeout(t);
      room.offlineTimers.delete(player);
    }
    const snap = room.players.get(player);
    if (snap && !snap.online) {
      snap.online = true;
      snap.updatedAt = Date.now();
    }
  }

  private cleanupRoomIfEmpty(room: Room): void {
    if (room.members.size > 0) return;
    if (room.offlineTimers.size > 0) return; // still expecting reconnects
    if (room.pendingTimer) clearTimeout(room.pendingTimer);
    if (room.idleCloseTimer) clearTimeout(room.idleCloseTimer);
    this.rooms.delete(room.name);
  }

  private scheduleBroadcast(room: Room): void {
    if (room.pendingTimer) return;
    const elapsed = Date.now() - room.lastBroadcast;
    const wait = Math.max(0, BROADCAST_MIN_INTERVAL_MS - elapsed);
    room.pendingTimer = setTimeout(() => {
      room.pendingTimer = undefined;
      room.lastBroadcast = Date.now();
      const msg = JSON.stringify(this.snapshot(room));
      for (const m of room.members) {
        if (m.socket.readyState === m.socket.OPEN) m.socket.send(msg);
      }
    }, wait);
  }
}

function cloneEncounter(enc: EncounterSummary): EncounterSummary {
  const players: Record<string, EncounterPlayer> = {};
  for (const [name, p] of Object.entries(enc.players)) {
    const cloned: EncounterPlayer = {
      amount: p.amount,
      duration: p.duration,
      attacks: p.attacks,
    };
    if (p.mobs) cloned.mobs = p.mobs;
    if (typeof p.detailSeq === 'number') cloned.detailSeq = p.detailSeq;
    players[name] = cloned;
  }
  return {
    id: enc.id,
    startedAt: enc.startedAt,
    endedAt: enc.endedAt,
    players,
  };
}
