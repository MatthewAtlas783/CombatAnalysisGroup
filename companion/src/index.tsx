import { render } from 'ink';
import { loadConfig } from './config.js';
import { findPluginDataDir, pickAccount, accountScopePath } from './paths.js';
import { readPluginData, watchPluginData, writePluginData } from './plugindata.js';
import { RelayClient } from './relay.js';
import { store } from './store.js';
import { App } from './ui/App.js';
import type { ServerMessage } from './protocol.js';

const LOCAL_KEY = 'CALocalStats';
const GROUP_KEY = 'CAGroupData';
const SEND_INTERVAL_MS = 500;

type LocalSnapshot = { player: string; amount: number; duration: number };

function asLocalSnapshot(raw: unknown, fallbackPlayer: string | undefined): LocalSnapshot | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const r = raw as Record<string, unknown>;
  const player = (typeof r.player === 'string' && r.player) || fallbackPlayer;
  const amount = typeof r.amount === 'number' ? r.amount : undefined;
  const duration = typeof r.duration === 'number' ? r.duration : 0;
  if (!player || amount === undefined) return undefined;
  return { player, amount, duration };
}

function main() {
  const config = loadConfig();

  const pluginDataDir = findPluginDataDir(config.pluginDataDir);
  const account = pickAccount(pluginDataDir, config.account);
  const inputPath = accountScopePath(pluginDataDir, account, LOCAL_KEY);
  const outputPath = accountScopePath(pluginDataDir, account, GROUP_KEY);

  store.set({
    room: config.room,
    player: config.player,
    inputPath,
    outputPath,
  });
  store.log('info', `account ${account}`);
  if (config.player) {
    store.log('info', `using configured player name "${config.player}"`);
  }

  const relay = new RelayClient(config.relayUrl, {
    onStatus: (status, info) => {
      const reconnectAt = info?.reconnectInMs ? Date.now() + info.reconnectInMs : undefined;
      store.set({
        relayStatus: status,
        relayDetail: info?.error,
        reconnectAt,
        joined: status === 'connected' ? store.get().joined : false,
      });
      if (status === 'connected') {
        const player = store.get().player;
        if (player) {
          relay.send({ type: 'join', room: config.room, player });
        }
        store.log('info', 'relay connected');
      } else if (status === 'reconnecting') {
        store.log('warn', `relay disconnected${info?.error ? `: ${info.error}` : ''}`);
      }
    },
    onMessage: (msg: ServerMessage) => {
      if (msg.type === 'joined') {
        store.set({ joined: true, room: msg.room });
        store.log('info', `joined room ${msg.room}`);
      } else if (msg.type === 'snapshot') {
        store.set({ players: msg.players });
        try {
          const playersOut: Record<string, number> = {};
          for (const [name, data] of Object.entries(msg.players)) {
            playersOut[name] = data.amount;
          }
          writePluginData(outputPath, { players: playersOut, updatedAt: Date.now() });
        } catch (err) {
          store.log('error', `write failed: ${err instanceof Error ? err.message : String(err)}`);
        }
      } else if (msg.type === 'error') {
        store.log('error', `relay: ${msg.message}`);
      }
    },
  });

  const stopWatch = watchPluginData(inputPath, (data, error) => {
    if (error) {
      store.log('warn', `read ${LOCAL_KEY} failed: ${error.message}`);
      return;
    }
    const snap = asLocalSnapshot(data, store.get().player);
    if (!snap) return;
    store.set(s => ({
      player: snap.player,
      local: { amount: snap.amount, duration: snap.duration, updatedAt: Date.now() },
    }));
    if (!store.get().joined && store.get().relayStatus === 'connected') {
      relay.send({ type: 'join', room: config.room, player: snap.player });
    }
  });

  // Pick up an initial value if the file already exists.
  try {
    const initial = readPluginData(inputPath);
    const snap = asLocalSnapshot(initial, config.player);
    if (snap) {
      store.set({
        player: snap.player,
        local: { amount: snap.amount, duration: snap.duration, updatedAt: Date.now() },
      });
    }
  } catch (err) {
    store.log('warn', `initial read failed: ${err instanceof Error ? err.message : String(err)}`);
  }

  const sendTimer = setInterval(() => {
    const local = store.get().local;
    const player = store.get().player;
    if (!local || !player) return;
    relay.send({ type: 'stats', player, amount: local.amount, duration: local.duration });
  }, SEND_INTERVAL_MS);

  relay.connect();

  const ink = render(<App
    relayUrl={config.relayUrl}
    onReconnect={() => {
      store.log('info', 'manual reconnect');
      relay.close();
      const fresh = new RelayClient(config.relayUrl, {
        onStatus: (status, info) => {
          const reconnectAt = info?.reconnectInMs ? Date.now() + info.reconnectInMs : undefined;
          store.set({ relayStatus: status, relayDetail: info?.error, reconnectAt });
        },
        onMessage: () => { /* swapped on reconnect — keep simple */ },
      });
      fresh.connect();
    }}
  />);

  const cleanup = () => {
    clearInterval(sendTimer);
    stopWatch();
    relay.close();
    ink.unmount();
  };
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  ink.waitUntilExit().then(cleanup);
}

try {
  main();
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(`\n${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
}
