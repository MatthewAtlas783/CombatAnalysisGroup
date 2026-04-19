import Store from 'electron-store';

export type Settings = {
  relayUrl: string;
  room: string;
  playerOverride: string;
  pluginDataDir: string;
  account: string;
  startMinimized: boolean;
  // Hidden dev flag: when true, the app polls GitHub Releases for updates.
  // Defaults to false so end users never auto-update; flip it on locally by
  // editing %APPDATA%/TumbaAnalysis/settings.json on the dev machine.
  autoUpdateEnabled: boolean;
};

const DEFAULTS: Settings = {
  relayUrl: 'wss://combatanalysisgroup-production.up.railway.app',
  room: 'lobby',
  playerOverride: '',
  pluginDataDir: '',
  account: '',
  startMinimized: false,
  autoUpdateEnabled: false,
};

const store = new Store<Settings>({
  name: 'settings',
  defaults: DEFAULTS,
});

export function getSettings(): Settings {
  return {
    relayUrl: store.get('relayUrl', DEFAULTS.relayUrl),
    room: store.get('room', DEFAULTS.room),
    playerOverride: store.get('playerOverride', DEFAULTS.playerOverride),
    pluginDataDir: store.get('pluginDataDir', DEFAULTS.pluginDataDir),
    account: store.get('account', DEFAULTS.account),
    startMinimized: store.get('startMinimized', DEFAULTS.startMinimized),
    autoUpdateEnabled: store.get('autoUpdateEnabled', DEFAULTS.autoUpdateEnabled),
  };
}

export function updateSettings(patch: Partial<Settings>): Settings {
  for (const [k, v] of Object.entries(patch)) {
    store.set(k, v);
  }
  return getSettings();
}
