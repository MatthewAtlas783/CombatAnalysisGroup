import type { WebSocket } from 'ws';
import type { PlayerSnapshot, ServerMessage } from './protocol.js';

type Member = {
  socket: WebSocket;
  player: string;
};

export type Room = {
  name: string;
  members: Set<Member>;
  players: Map<string, PlayerSnapshot>;
  lastBroadcast: number;
  pendingTimer: NodeJS.Timeout | undefined;
};

const PLAYER_TTL_MS = 5 * 60 * 1000;
const BROADCAST_MIN_INTERVAL_MS = 250;

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
  ): Room | undefined {
    const entry = this.membership.get(socket);
    if (!entry) return undefined;
    const room = entry.room;
    this.pruneExpired(room);
    room.players.set(player, { amount, duration, updatedAt: Date.now() });
    this.scheduleBroadcast(room);
    return room;
  }

  snapshot(room: Room): ServerMessage {
    this.pruneExpired(room);
    const players: Record<string, PlayerSnapshot> = {};
    for (const [name, data] of room.players) players[name] = data;
    return { type: 'snapshot', players };
  }

  stats() {
    return {
      rooms: this.rooms.size,
      sockets: this.membership.size,
    };
  }

  private pruneExpired(room: Room): void {
    const cutoff = Date.now() - PLAYER_TTL_MS;
    for (const [name, data] of room.players) {
      if (data.updatedAt < cutoff) room.players.delete(name);
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
