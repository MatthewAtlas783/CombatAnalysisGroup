export type Config = {
  relayUrl: string;
  room: string;
  player: string | undefined;
  pluginDataDir: string | undefined;
  account: string | undefined;
};

function required(name: string): string {
  const v = process.env[name];
  if (!v || v.trim() === '') {
    throw new Error(`Missing required env var ${name}. See .env.example.`);
  }
  return v.trim();
}

function optional(name: string): string | undefined {
  const v = process.env[name];
  if (!v || v.trim() === '') return undefined;
  return v.trim();
}

export function loadConfig(): Config {
  return {
    relayUrl: required('CAG_RELAY_URL'),
    room: required('CAG_ROOM'),
    player: optional('CAG_PLAYER'),
    pluginDataDir: optional('CAG_PLUGINDATA_DIR'),
    account: optional('CAG_ACCOUNT'),
  };
}
