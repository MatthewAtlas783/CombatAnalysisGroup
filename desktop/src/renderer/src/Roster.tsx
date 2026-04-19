import type { AppState } from '../../main/service.js';

function fmtNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'k';
  return Math.round(n).toString();
}

function fmtRate(amount: number, durationSec: number): string {
  if (!durationSec || durationSec <= 0) return '–';
  const dps = amount / durationSec;
  return fmtNumber(dps);
}

function fmtAge(updatedAt: number, now: number): string {
  const diff = Math.max(0, Math.round((now - updatedAt) / 1000));
  if (diff < 5) return 'now';
  if (diff < 60) return diff + 's';
  const m = Math.floor(diff / 60);
  return m + 'm';
}

export function Roster({ state, now }: { state: AppState; now: number }) {
  const rows = Object.entries(state.players)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.amount - a.amount);

  const top = rows[0]?.amount ?? 1;

  if (rows.length === 0) {
    return (
      <div className="roster-empty">
        <div className="empty-title">No parses yet</div>
        <div className="empty-sub">
          Once you (or anyone in your room) deals damage, they'll appear here in real time.
        </div>
      </div>
    );
  }

  return (
    <div className="roster">
      <div className="roster-head">
        <span className="col col-player">player</span>
        <span className="col col-damage">damage</span>
        <span className="col col-dps">dps</span>
        <span className="col col-age">age</span>
      </div>
      {rows.map(row => {
        const pct = Math.max(2, Math.min(100, (row.amount / top) * 100));
        const isMe = row.name === state.player;
        return (
          <div key={row.name} className={`roster-row${isMe ? ' me' : ''}`}>
            <div className="roster-bar" style={{ width: pct + '%' }} />
            <div className="roster-cells">
              <span className="col col-player">{row.name}</span>
              <span className="col col-damage">{fmtNumber(row.amount)}</span>
              <span className="col col-dps">{fmtRate(row.amount, row.duration)}</span>
              <span className="col col-age">{fmtAge(row.updatedAt, now)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
