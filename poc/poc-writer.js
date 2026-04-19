#!/usr/bin/env node
/*
  CombatAnalysisGroup POC writer

  Simulates the companion app. Writes a Lua-literal plugindata file with an
  incrementing counter every 2 seconds into every LOTRO account folder on this
  machine. The in-game plugin (CombatAnalysisGroupPOC) should read these
  updates and print them to chat.

  Usage:
    node poc-writer.js               # auto-detect LOTRO PluginData path
    node poc-writer.js <pluginDataDir>
*/

const fs = require('fs');
const path = require('path');
const os = require('os');

const KEY = 'CAGroupPOC';

function findPluginDataDir(explicit) {
  if (explicit) return explicit;

  const home = os.homedir();
  const candidates = [
    path.join(home, 'OneDrive', 'Documents', 'The Lord of the Rings Online', 'PluginData'),
    path.join(home, 'Documents', 'The Lord of the Rings Online', 'PluginData'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  throw new Error(`PluginData folder not found. Checked: ${candidates.join(', ')}`);
}

function listAccounts(pluginDataDir) {
  return fs.readdirSync(pluginDataDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
}

// Serialize a JS value as Lua literal source. Matches the format written by
// Turbine.PluginData.Save (a `return { ... }` module).
function toLua(value, indent = '') {
  if (value === null || value === undefined) return 'nil';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return 'nil';
    return Number.isInteger(value) ? value.toFixed(6) : String(value);
  }
  if (typeof value === 'string') {
    const escaped = value
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r');
    return `"${escaped}"`;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '{}';
    const inner = indent + '\t';
    const parts = value.map(v => `${inner}${toLua(v, inner)}`);
    return `{\n${parts.join(',\n')}\n${indent}}`;
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) return '{}';
    const inner = indent + '\t';
    const parts = keys.map(k => {
      const keyRepr = /^[A-Za-z_][A-Za-z0-9_]*$/.test(k) ? `["${k}"]` : `[${toLua(k, inner)}]`;
      return `${inner}${keyRepr} = ${toLua(value[k], inner)}`;
    });
    return `{\n${parts.join(',\n')}\n${indent}}`;
  }
  return 'nil';
}

function writePluginData(accountDir, key, data) {
  const dir = path.join(accountDir, 'AllServers');
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${key}.plugindata`);
  const body = `return \n${toLua(data)}`;
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, body, 'utf8');
  fs.renameSync(tmp, file);
  return file;
}

function main() {
  const pluginDataDir = findPluginDataDir(process.argv[2]);
  console.log(`PluginData: ${pluginDataDir}`);
  const accounts = listAccounts(pluginDataDir);
  if (accounts.length === 0) {
    console.error('No account folders found.');
    process.exit(1);
  }
  console.log(`Writing to ${accounts.length} account folder(s): ${accounts.join(', ')}`);

  let counter = 0;
  const tick = () => {
    counter += 1;
    const payload = {
      counter,
      writtenAt: new Date().toISOString(),
      message: `poc tick #${counter}`,
    };
    for (const account of accounts) {
      try {
        const file = writePluginData(path.join(pluginDataDir, account), KEY, payload);
        if (counter === 1) console.log(`  -> ${file}`);
      } catch (err) {
        console.error(`  !! ${account}: ${err.message}`);
      }
    }
    console.log(`[${new Date().toLocaleTimeString()}] counter=${counter}`);
  };

  tick();
  setInterval(tick, 2000);
  console.log('Running. Ctrl+C to stop.');
}

main();
