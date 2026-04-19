import fs from 'node:fs';
import path from 'node:path';
import chokidar from 'chokidar';
import { serialize, parse } from './lua.js';

export function readPluginData(filePath: string): unknown | undefined {
  if (!fs.existsSync(filePath)) return undefined;
  const text = fs.readFileSync(filePath, 'utf8');
  if (text.trim() === '') return undefined;
  return parse(text);
}

export function writePluginData(filePath: string, data: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const tmp = filePath + '.tmp';
  fs.writeFileSync(tmp, serialize(data), 'utf8');
  fs.renameSync(tmp, filePath);
}

export function watchPluginData(
  filePath: string,
  onChange: (data: unknown | undefined, error?: Error) => void,
): () => void {
  const watcher = chokidar.watch(filePath, {
    awaitWriteFinish: { stabilityThreshold: 150, pollInterval: 50 },
    ignoreInitial: false,
  });
  let lastMtime = 0;
  const handler = () => {
    try {
      // Track mtime so the fallback poll can skip if nothing changed.
      try {
        const stat = fs.statSync(filePath);
        lastMtime = stat.mtimeMs;
      } catch { /* file may not exist yet */ }
      const data = readPluginData(filePath);
      onChange(data);
    } catch (err) {
      onChange(undefined, err instanceof Error ? err : new Error(String(err)));
    }
  };
  watcher.on('add', handler);
  watcher.on('change', handler);
  watcher.on('unlink', () => onChange(undefined));
  // H2 fix: fallback poll — if chokidar's awaitWriteFinish swallows rapid
  // writes (e.g. during active combat at 250ms intervals), this catches
  // what was missed. Only fires the callback if the file actually changed.
  const fallback = setInterval(() => {
    try {
      if (!fs.existsSync(filePath)) return;
      const stat = fs.statSync(filePath);
      if (stat.mtimeMs > lastMtime) {
        lastMtime = stat.mtimeMs;
        const data = readPluginData(filePath);
        onChange(data);
      }
    } catch { /* swallow — next poll will retry */ }
  }, 500);
  return () => {
    clearInterval(fallback);
    void watcher.close();
  };
}
