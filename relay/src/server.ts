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
      );
      if (!room) sendError(socket, 'join a room before sending stats');
    } else if (msg.type === 'leave') {
      registry.leave(socket);
    }
  });

  socket.on('close', () => {
    registry.leave(socket);
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
