import WebSocket from 'ws';
import type { ClientMessage, ServerMessage } from './protocol.js';

export type RelayStatus = 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'closed';

export type RelayEvents = {
  onStatus: (status: RelayStatus, info?: { reconnectInMs?: number; error?: string }) => void;
  onMessage: (msg: ServerMessage) => void;
};

const BACKOFF_MIN = 1000;
const BACKOFF_MAX = 30_000;

export class RelayClient {
  private ws: WebSocket | undefined;
  private closed = false;
  private backoff = BACKOFF_MIN;
  private reconnectTimer: NodeJS.Timeout | undefined;
  private outbox: ClientMessage[] = [];

  constructor(private url: string, private events: RelayEvents) {}

  connect(): void {
    if (this.closed) return;
    this.events.onStatus('connecting');
    let ws: WebSocket;
    try {
      ws = new WebSocket(this.url);
    } catch (err) {
      this.scheduleReconnect(err instanceof Error ? err.message : String(err));
      return;
    }
    this.ws = ws;

    ws.on('open', () => {
      this.backoff = BACKOFF_MIN;
      this.events.onStatus('connected');
      const queued = this.outbox;
      this.outbox = [];
      for (const msg of queued) this.send(msg);
    });

    ws.on('message', raw => {
      try {
        const msg = JSON.parse(raw.toString()) as ServerMessage;
        this.events.onMessage(msg);
      } catch {
        // ignore malformed frames
      }
    });

    ws.on('close', () => {
      if (this.closed) return;
      this.scheduleReconnect();
    });

    ws.on('error', err => {
      this.scheduleReconnect(err.message);
    });
  }

  send(msg: ClientMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    } else {
      // Drop duplicate stats messages — only the freshest is interesting.
      if (msg.type === 'stats') {
        this.outbox = this.outbox.filter(m => m.type !== 'stats');
      }
      this.outbox.push(msg);
    }
  }

  close(): void {
    this.closed = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.events.onStatus('closed');
    if (this.ws) {
      try { this.ws.close(); } catch { /* noop */ }
    }
  }

  private scheduleReconnect(error?: string): void {
    if (this.closed) return;
    if (this.reconnectTimer) return;
    const delay = this.backoff;
    this.backoff = Math.min(this.backoff * 2, BACKOFF_MAX);
    this.events.onStatus('reconnecting', { reconnectInMs: delay, error });
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = undefined;
      this.connect();
    }, delay);
  }
}
