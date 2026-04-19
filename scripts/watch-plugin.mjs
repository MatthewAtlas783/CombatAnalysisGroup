#!/usr/bin/env node
// Watch the repo's plugin/ directory and re-run scripts/sync-plugin.sh on any
// change, debounced. Keeps the live LOTRO install in lockstep with edits so
// `/plugins reload` in-game is the only manual step.
//
// Usage: node scripts/watch-plugin.mjs
//        LOTRO_PLUGINS_DIR=... node scripts/watch-plugin.mjs   (override target)
//
// Zero dependencies — uses Node's built-in fs.watch in recursive mode.
import { watch } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repo = dirname(here);
const pluginDir = join(repo, 'plugin');
const syncScript = join(here, 'sync-plugin.sh');

function runSync(reason) {
  const started = Date.now();
  const res = spawnSync('bash', [syncScript], { stdio: 'inherit', env: process.env });
  const ms = Date.now() - started;
  if (res.status !== 0) {
    console.error(`[watch-plugin] sync failed (exit ${res.status}) — ${reason}`);
  } else {
    console.log(`[watch-plugin] synced in ${ms}ms — ${reason}`);
  }
}

// Initial sync so the install is current before we start watching.
runSync('startup');

// Debounce: editors write-save-in-bursts (especially VS Code's atomic save),
// so coalesce rapid changes into a single sync. 150ms is invisible to humans
// and well below LOTRO's /plugins reload cycle.
let pending;
function schedule(path) {
  clearTimeout(pending);
  pending = setTimeout(() => runSync(`change: ${path}`), 150);
}

const watcher = watch(pluginDir, { recursive: true }, (_event, filename) => {
  if (!filename) return;
  // Ignore temp files editors leave behind during save.
  if (filename.endsWith('~') || filename.startsWith('.~') || filename.endsWith('.swp')) return;
  schedule(filename);
});

console.log(`[watch-plugin] watching ${pluginDir} — Ctrl+C to stop`);

process.on('SIGINT', () => {
  watcher.close();
  process.exit(0);
});
