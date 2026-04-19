import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export function findPluginDataDir(explicit: string | undefined): string {
  if (explicit) {
    if (!fs.existsSync(explicit)) throw new Error(`CAG_PLUGINDATA_DIR does not exist: ${explicit}`);
    return explicit;
  }
  const home = os.homedir();
  const candidates = [
    path.join(home, 'OneDrive', 'Documents', 'The Lord of the Rings Online', 'PluginData'),
    path.join(home, 'Documents', 'The Lord of the Rings Online', 'PluginData'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  throw new Error(`PluginData folder not found. Set CAG_PLUGINDATA_DIR. Checked: ${candidates.join(', ')}`);
}

export function pickAccount(pluginDataDir: string, explicit: string | undefined): string {
  const accounts = fs.readdirSync(pluginDataDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name !== 'AllAccounts')
    .map(d => d.name);
  if (accounts.length === 0) {
    throw new Error(`No account folders inside ${pluginDataDir}. Launch the game once with the plugin enabled.`);
  }
  if (explicit) {
    if (!accounts.includes(explicit)) {
      throw new Error(`CAG_ACCOUNT '${explicit}' not found. Available: ${accounts.join(', ')}`);
    }
    return explicit;
  }
  if (accounts.length === 1) return accounts[0]!;
  // multiple accounts: pick the most recently modified
  const ranked = accounts
    .map(a => ({ name: a, mtime: fs.statSync(path.join(pluginDataDir, a)).mtimeMs }))
    .sort((x, y) => y.mtime - x.mtime);
  return ranked[0]!.name;
}

export function accountScopePath(pluginDataDir: string, account: string, key: string): string {
  return path.join(pluginDataDir, account, 'AllServers', `${key}.plugindata`);
}
