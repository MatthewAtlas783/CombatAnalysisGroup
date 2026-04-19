import type { WebSocket } from 'ws';
import type {
  EncounterPlayer,
  EncounterSummary,
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
};

const PLAYER_TTL_MS = 5 * 60 * 1000;
const BROADCAST_MIN_INTERVAL_MS = 250;
const ENCOUNTER_IDLE_CLOSE_MS = 5_000;
const HISTORY_LIMIT = 30;

export class RoomRegistry {
  private rooms = new Map<string, Room>();
  private membership = new Map<WebSocket, { member: Member; room: Room }>();

  join(socket: WebSocket, roomName: string, player: string): Room {
    this.leave(socket);
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
      };
      this.rooms.set(roomName, room);
    }
    const member: Member = { socket, player };
    room.members.add(member);
    this.membership.set(socket, { member, room });
    return room;
  }

  leave(socket: WebSocket): void {
    const entry = this.membership.get(socket);
    if (!entry) return;
    entry.room.members.delete(entry.member);
    this.membership.delete(socket);
    if (entry.room.members.size === 0) {
      if (entry.room.pendingTimer) clearTimeout(entry.room.pendingTimer);
      if (entry.room.idleCloseTimer) clearTimeout(entry.room.idleCloseTimer);
      this.rooms.delete(entry.room.name);
    } else {
      this.scheduleBroadcast(entry.room);
    }
  }

  recordStats(
    socket: WebSocket,
    player: string,
    amount: number,
    duration: number,
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

    room.players.set(player, { amount, duration, updatedAt: now, inCombat });

    if (room.current) {
      this.updateEncounterPlayer(room, player, amount, duration);
    }

    this.refreshIdleTimer(room);
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
    for (const p of room.players.values()) if (p.inCombat) return true;
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
        lastReportedAmount: snap.amount,
      });
    }
  }

  private updateEncounterPlayer(
    room: Room,
    player: string,
    reportedAmount: number,
    reportedDuration: number,
  ): void {
    if (!room.current) return;
    let baseline = room.baselines.get(player);
    if (!baseline) {
      baseline = { amount: 0, duration: 0, lastReportedAmount: 0 };
      room.baselines.set(player, baseline);
    }
    // Plugin reset (new local encounter) — reported drops below last seen.
    // Re-anchor baseline to 0 so subsequent growth counts fully.
    if (reportedAmount < baseline.lastReportedAmount) {
      baseline.amount = 0;
      baseline.duration = 0;
    }
    baseline.lastReportedAmount = reportedAmount;

    const amount = Math.max(0, reportedAmount - baseline.amount);
    const duration = Math.max(0, reportedDuration - baseline.duration);
    const entry: EncounterPlayer = { amount, duration };
    room.current.players[player] = entry;
  }

  private refreshIdleTimer(room: Room): void {
    if (!room.current) return;
    if (room.idleCloseTimer) clearTimeout(room.idleCloseTimer);
    const inCombat = this.isRoomInCombat(room);
    if (inCombat) return; // stay open while anyone is fighting
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
      if (data.updatedAt < cutoff) {
        room.players.delete(name);
        room.baselines.delete(name);
      }
    }
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
    players[name] = { amount: p.amount, duration: p.duration };
  }
  return {
    id: enc.id,
    startedAt: enc.startedAt,
    endedAt: enc.endedAt,
    players,
  };
}
