import type { AppState } from '../../main/service.js';
import type { EncounterSummary } from '../../main/protocol.js';

function fmtNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'k';
  return Math.round(n).toString();
}

function fmtRate(amount: number, durationSec: number): string {
  if (!durationSec || durationSec <= 0) return '–';
  return fmtNumber(amount / durationSec);
}

function fmtAge(updatedAt: number, now: number): string {
  const diff = Math.max(0, Math.round((now - updatedAt) / 1000));
  if (diff < 5) return 'now';
  if (diff < 60) return diff + 's';
  const m = Math.floor(diff / 60);
  return m + 'm';
}

function fmtClock(ts: number): string {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function fmtDuration(sec: number): string {
  if (sec < 60) return Math.round(sec) + 's';
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}m${s.toString().padStart(2, '0')}s`;
}

function encounterDurationSec(enc: EncounterSummary, now: number): number {
  const end = enc.endedAt ?? now;
  return Math.max(0, (end - enc.startedAt) / 1000);
}

function encounterTotal(enc: EncounterSummary): number {
  let total = 0;
  for (const p of Object.values(enc.players)) total += p.amount;
  return total;
}

type ViewRow = {
  name: string;
  amount: number;
  duration: number;
  updatedAt: number;
  online: boolean;
};

type ViewModel = {
  rows: ViewRow[];
  title: string;
  subtitle: string | undefined;
  totalAmount: number;
  totalDuration: number;
  showAge: boolean;
  isEmpty: boolean;
  emptyTitle: string;
  emptySub: string;
};

export function Roster({ state, now }: { state: AppState; now: number }) {
  const view = pickView(state, now);
  const rows = view.rows.slice().sort((a, b) => b.amount - a.amount);
  const top = rows[0]?.amount ?? 1;

  return (
    <div className="roster-wrap">
      <EncounterBar state={state} now={now} />

      <div className="encounter-summary">
        <div className="enc-summary-main">
          <span className="enc-summary-title">{view.title}</span>
          {view.subtitle && (
            <span className="enc-summary-sub">{view.subtitle}</span>
          )}
        </div>
        <div className="enc-summary-stats">
          <span className="enc-stat">
            <span className="enc-stat-value">{fmtNumber(view.totalAmount)}</span>
            <span className="enc-stat-label">total dmg</span>
          </span>
          <span className="enc-stat">
            <span className="enc-stat-value">{fmtRate(view.totalAmount, view.totalDuration)}</span>
            <span className="enc-stat-label">group dps</span>
          </span>
          <span className="enc-stat">
            <span className="enc-stat-value">{fmtDuration(view.totalDuration)}</span>
            <span className="enc-stat-label">duration</span>
          </span>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="roster-empty">
          <div className="empty-title">{view.emptyTitle}</div>
          <div className="empty-sub">{view.emptySub}</div>
        </div>
      ) : (
        <div className="roster">
          {rows.map((row, idx) => {
            const pct = Math.max(2, Math.min(100, (row.amount / top) * 100));
            const isMe = row.name === state.player;
            const rowClass = [
              'roster-row',
              isMe ? 'me' : '',
              row.online ? '' : 'offline',
            ].filter(Boolean).join(' ');
            return (
              <div key={row.name} className={rowClass}>
                <div className="roster-bar" style={{ width: pct + '%' }} />
                <div className="roster-cells">
                  <span className="col col-rank">{idx + 1}</span>
                  <span className="col col-player">
                    {row.name}
                    {!row.online && <span className="offline-tag">offline</span>}
                  </span>
                  <span className="col col-damage">{fmtNumber(row.amount)}</span>
                  <span className="col col-dps">{fmtRate(row.amount, row.duration)}</span>
                  {view.showAge && (
                    <span className="col col-age">{fmtAge(row.updatedAt, now)}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function pickView(state: AppState, now: number): ViewModel {
  // Historical encounter selected
  if (state.selectedEncounterId !== undefined) {
    const enc = state.history.find(e => e.id === state.selectedEncounterId);
    if (enc) {
      const dur = encounterDurationSec(enc, now);
      const total = encounterTotal(enc);
      return {
        rows: Object.entries(enc.players).map(([name, p]) => ({
          name,
          amount: p.amount,
          duration: p.duration || dur,
          updatedAt: enc.endedAt ?? enc.startedAt,
          online: state.players[name]?.online ?? true,
        })),
        title: `Encounter #${enc.id}`,
        subtitle: `${fmtClock(enc.startedAt)}${enc.endedAt ? ` → ${fmtClock(enc.endedAt)}` : ' · in progress'}`,
        totalAmount: total,
        totalDuration: dur,
        showAge: false,
        isEmpty: total === 0,
        emptyTitle: 'no damage recorded',
        emptySub: 'nobody dealt damage during this encounter.',
      };
    }
  }
  // Live current encounter
  if (state.currentEncounter) {
    const enc = state.currentEncounter;
    const dur = encounterDurationSec(enc, now);
    const total = encounterTotal(enc);
    return {
      rows: Object.entries(enc.players).map(([name, p]) => ({
        name,
        amount: p.amount,
        duration: p.duration || dur,
        updatedAt: state.players[name]?.updatedAt ?? enc.startedAt,
        online: state.players[name]?.online ?? true,
      })),
      title: 'Live encounter',
      subtitle: `started ${fmtClock(enc.startedAt)}`,
      totalAmount: total,
      totalDuration: dur,
      showAge: true,
      isEmpty: total === 0,
      emptyTitle: 'encounter just started',
      emptySub: 'waiting for first damage numbers to arrive.',
    };
  }
  // Idle — show latest history entry if any
  const latest = state.history[0];
  if (latest) {
    const dur = encounterDurationSec(latest, now);
    const total = encounterTotal(latest);
    return {
      rows: Object.entries(latest.players).map(([name, p]) => ({
        name,
        amount: p.amount,
        duration: p.duration || dur,
        updatedAt: latest.endedAt ?? latest.startedAt,
        online: state.players[name]?.online ?? true,
      })),
      title: `Last encounter · #${latest.id}`,
      subtitle: `${fmtClock(latest.startedAt)}${latest.endedAt ? ` → ${fmtClock(latest.endedAt)}` : ''} · idle`,
      totalAmount: total,
      totalDuration: dur,
      showAge: false,
      isEmpty: total === 0,
      emptyTitle: 'no combat yet',
      emptySub: 'step into a fight in-game and the group will populate here.',
    };
  }
  // Nothing yet
  return {
    rows: [],
    title: 'No encounters yet',
    subtitle: undefined,
    totalAmount: 0,
    totalDuration: 0,
    showAge: false,
    isEmpty: true,
    emptyTitle: 'No parses yet',
    emptySub: 'Once you (or anyone in your room) deals damage, an encounter will appear here.',
  };
}

function EncounterBar({ state, now }: { state: AppState; now: number }) {
  const hasAny = state.history.length > 0 || state.currentEncounter !== undefined;
  if (!state.joined && !hasAny) return null;

  return (
    <div className="encounter-bar">
      <span className="encounter-bar-label">Encounters</span>
      <div className="encounter-bar-pills">
        <button
          className={`enc-pill ${
            state.selectedEncounterId === undefined ? 'enc-pill-active' : ''
          } ${state.currentEncounter ? 'enc-pill-live' : ''}`}
          onClick={() => window.tumba.selectEncounter(undefined)}
          title={state.currentEncounter ? 'live encounter in progress' : 'auto-follow newest encounter'}
        >
          {state.currentEncounter ? (
            <>
              <span className="enc-pill-dot" /> Live
            </>
          ) : (
            'Live'
          )}
        </button>
        {state.history.map(enc => {
          const dur = encounterDurationSec(enc, now);
          return (
            <button
              key={enc.id}
              className={`enc-pill ${state.selectedEncounterId === enc.id ? 'enc-pill-active' : ''}`}
              onClick={() => window.tumba.selectEncounter(enc.id)}
              title={`${fmtClock(enc.startedAt)}${enc.endedAt ? ` → ${fmtClock(enc.endedAt)}` : ''} · ${fmtDuration(dur)}`}
            >
              <span className="enc-pill-id">#{enc.id}</span>
              <span className="enc-pill-time">{fmtClock(enc.startedAt)}</span>
            </button>
          );
        })}
        {!hasAny && (
          <span className="enc-pill-empty">no encounters yet — first fight will show up here</span>
        )}
      </div>
    </div>
  );
}
