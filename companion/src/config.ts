export type Config = {
  relayUrl: string;
  room: string;
  player: string | undefined;
  pluginDataDir: string | undefined;
  account: string | undefined;
};

const DEFAULT_RELAY_URL = 'wss://combatanalysisgroup-production.up.railway.app';
const DEFAULT_ROOM = 'lobby';

function withDefault(name: string, fallback: string): string {
  const v = process.env[name];
  if (!v || v.trim() === '') return fallback;
  return v.trim();
}

function optional(name: string): string | undefined {
  const v = process.env[name];
  if (!v || v.trim() === '') return undefined;
  return v.trim();
}

export function loadConfig(): Config {
  return {
    relayUrl: withDefault('CAG_RELAY_URL', DEFAULT_RELAY_URL),
    room: withDefault('CAG_ROOM', DEFAULT_ROOM),
    player: optional('CAG_PLAYER'),
    pluginDataDir: optional('CAG_PLUGINDATA_DIR'),
    account: optional('CAG_ACCOUNT'),
  };
}
