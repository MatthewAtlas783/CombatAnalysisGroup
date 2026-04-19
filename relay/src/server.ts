import { createServer } from 'node:http';
import { WebSocketServer, type WebSocket } from 'ws';
import { RoomRegistry } from './rooms.js';
import type { ClientMessage, ServerMessage } from './protocol.js';

const PORT = Number(process.env.PORT ?? 8787);
const MAX_MESSAGE_BYTES = 4 * 1024;
const PING_INTERVAL_MS = 30_000;

const registry = new RoomRegistry();

const http = createServer((req, res) => {
  if (req.url === '/health' || req.url === '/') {
    const body = JSON.stringify({ ok: true, ...registry.stats() });
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(body);
    return;
  }
  res.writeHead(404).end();
});

const wss = new WebSocketServer({ server: http, maxPayload: MAX_MESSAGE_BYTES });

function send(socket: WebSocket, msg: ServerMessage) {
  if (socket.readyState === socket.OPEN) socket.send(JSON.stringify(msg));
}

function sendError(socket: WebSocket, message: string) {
  send(socket, { type: 'error', message });
}

function parse(raw: unknown): ClientMessage | undefined {
  if (typeof raw !== 'string') return undefined;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return undefined;
  }
  if (!data || typeof data !== 'object') return undefined;
  const obj = data as Record<string, unknown>;
  switch (obj.type) {
    case 'join':
      if (typeof obj.room === 'string' && typeof obj.player === 'string') {
        return { type: 'join', room: obj.room, player: obj.player };
      }
      return undefined;
    case 'stats':
      if (
        typeof obj.player === 'string' &&
        typeof obj.amount === 'number' &&
        typeof obj.duration === 'number'
      ) {
        return {
          type: 'stats',
          player: obj.player,
          amount: obj.amount,
          duration: obj.duration,
          attacks: typeof obj.attacks === 'number' ? obj.attacks : 0,
          inCombat: typeof obj.inCombat === 'boolean' ? obj.inCombat : false,
        };
      }
      return undefined;
    case 'encounterDetail':
      if (
        typeof obj.player === 'string' &&
        typeof obj.seq === 'number' &&
        Array.isArray(obj.mobs)
      ) {
        return {
          type: 'encounterDetail',
          player: obj.player,
          seq: obj.seq,
          duration: typeof obj.duration === 'number' ? obj.duration : 0,
          total: typeof obj.total === 'number' ? obj.total : 0,
          attacks: typeof obj.attacks === 'number' ? obj.attacks : 0,
          // Trust-but-normalize: we rely on mobs being correctly shaped here
          // (plugin is the only writer). Malformed entries get dropped by
          // renderer-side checks rather than hand-validated per field.
          mobs: obj.mobs as never,
        };
      }
      return undefined;
    case 'leave':
      return { type: 'leave' };
    default:
      return undefined;
  }
}

wss.on('connection', (socket, req) => {
  const remote = req.socket.remoteAddress ?? 'unknown';
  let alive = true;

  socket.on('pong', () => {
    alive = true;
  });

  socket.on('message', raw => {
    const text = raw.toString('utf8');
    const msg = parse(text);
    if (!msg) {
      sendError(socket, 'invalid message');
      return;
    }

    if (msg.type === 'join') {
      if (!msg.room || !msg.player) {
        sendError(socket, 'join requires room and player');
        return;
      }
      const room = registry.join(socket, msg.room, msg.player);
      send(socket, { type: 'joined', room: room.name });
      send(socket, registry.snapshot(room));
      log(`join room=${msg.room} player=${msg.player} from=${remote}`);
    } else if (msg.type === 'stats') {
      const room = registry.recordStats(
        socket,
        msg.player,
        msg.amount,
        msg.duration,
        msg.attacks,
        msg.inCombat,
      );
      if (!room) sendError(socket, 'join a room before sending stats');
    } else if (msg.type === 'encounterDetail') {
      const room = registry.recordEncounterDetail(
        socket,
        msg.player,
        msg.seq,
        msg.mobs,
      );
      if (!room) sendError(socket, 'join a room before sending encounter detail');
    } else if (msg.type === 'leave') {
      registry.leave(socket);
    }
  });

  // Disconnect != leave. The socket is gone (network blip, app quit, crash)
  // but we don't want to immediately yank the player's stats from peers'
  // Group tabs. markOffline marks them dimmed and starts a 3-min TTL.
  socket.on('close', () => {
    registry.markOffline(socket);
    log(`disconnect from=${remote}`);
  });

  socket.on('error', err => {
    log(`socket error from=${remote}: ${err.message}`);
  });

  const ping = setInterval(() => {
    if (!alive) {
      socket.terminate();
      clearInterval(ping);
      return;
    }
    alive = false;
    socket.ping();
  }, PING_INTERVAL_MS);

  socket.on('close', () => clearInterval(ping));

  log(`connect from=${remote}`);
});

function log(message: string) {
  const ts = new Date().toISOString();
  // eslint-disable-next-line no-console
  console.log(`${ts} ${message}`);
}

http.listen(PORT, () => {
  log(`relay listening on :${PORT}`);
});

const shutdown = (signal: string) => () => {
  log(`shutdown ${signal}`);
  wss.close();
  http.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5_000).unref();
};

process.on('SIGINT', shutdown('SIGINT'));
process.on('SIGTERM', shutdown('SIGTERM'));
