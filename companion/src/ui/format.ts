export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return '–';
  return Math.round(n).toLocaleString('en-US');
}

export function formatRate(amount: number, durationSec: number): string {
  if (!Number.isFinite(amount) || durationSec <= 0) return '–';
  return formatNumber(amount / durationSec);
}

export function formatRelative(ts: number | undefined, now: number = Date.now()): string {
  if (!ts) return '–';
  const diff = Math.max(0, now - ts);
  if (diff < 1000) return 'now';
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
  return `${Math.floor(diff / 3_600_000)}h`;
}

export function pad(s: string, width: number, align: 'left' | 'right' = 'left'): string {
  if (s.length >= width) return s.slice(0, width);
  const fill = ' '.repeat(width - s.length);
  return align === 'right' ? fill + s : s + fill;
}

export function abbreviatePath(p: string, max = 64): string {
  if (p.length <= max) return p;
  const head = p.slice(0, 16);
  const tail = p.slice(-(max - 19));
  return `${head}…${tail}`;
}
