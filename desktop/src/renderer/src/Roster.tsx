import type { AppState } from '../../main/service.js';
import type { EncounterSummary } from '../../main/protocol.js';

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

function fmtClock(ts: number): string {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

function encounterDurationSec(enc: EncounterSummary): number {
  const end = enc.endedAt ?? Date.now();
  return Math.max(0, (end - enc.startedAt) / 1000);
}

type ViewRow = {
  name: string;
  amount: number;
  duration: number;
  updatedAt: number;
};

export function Roster({ state, now }: { state: AppState; now: number }) {
  const view = pickView(state);

  const rows: ViewRow[] = view.rows;
  rows.sort((a, b) => b.amount - a.amount);
  const top = rows[0]?.amount ?? 1;

  return (
    <div className="roster-wrap">
      <EncounterBar state={state} />

      {view.heading && <div className="roster-heading">{view.heading}</div>}

      {rows.length === 0 ? (
        <div className="roster-empty">
          <div className="empty-title">{view.emptyTitle}</div>
          <div className="empty-sub">{view.emptySub}</div>
        </div>
      ) : (
        <div className="roster">
          <div className="roster-head">
            <span className="col col-player">player</span>
            <span className="col col-damage">damage</span>
            <span className="col col-dps">dps</span>
            <span className="col col-age">{view.showAge ? 'age' : ''}</span>
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
                  <span className="col col-age">
                    {view.showAge ? fmtAge(row.updatedAt, now) : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

type ViewModel = {
  rows: ViewRow[];
  heading: string | undefined;
  emptyTitle: string;
  emptySub: string;
  showAge: boolean;
};

function pickView(state: AppState): ViewModel {
  // Historical encounter selected
  if (state.selectedEncounterId !== undefined) {
    const enc = state.history.find(e => e.id === state.selectedEncounterId);
    if (enc) {
      return {
        rows: Object.entries(enc.players).map(([name, p]) => ({
          name,
          amount: p.amount,
          duration: p.duration || encounterDurationSec(enc),
          updatedAt: enc.endedAt ?? enc.startedAt,
        })),
        heading: `encounter #${enc.id} · ${fmtClock(enc.startedAt)}${
          enc.endedAt ? ` → ${fmtClock(enc.endedAt)}` : ' · in progress'
        }`,
        emptyTitle: 'no damage recorded',
        emptySub: 'nobody dealt damage during this encounter.',
        showAge: false,
      };
    }
  }
  // Live current encounter
  if (state.currentEncounter) {
    const enc = state.currentEncounter;
    return {
      rows: Object.entries(enc.players).map(([name, p]) => ({
        name,
        amount: p.amount,
        duration: p.duration || encounterDurationSec(enc),
        updatedAt: state.players[name]?.updatedAt ?? enc.startedAt,
      })),
      heading: `current encounter · started ${fmtClock(enc.startedAt)}`,
      emptyTitle: 'encounter just started',
      emptySub: 'waiting for first damage numbers to arrive.',
      showAge: true,
    };
  }
  // Idle — show latest history entry if any
  const latest = state.history[0];
  if (latest) {
    return {
      rows: Object.entries(latest.players).map(([name, p]) => ({
        name,
        amount: p.amount,
        duration: p.duration || encounterDurationSec(latest),
        updatedAt: latest.endedAt ?? latest.startedAt,
      })),
      heading: `last encounter · ${fmtClock(latest.startedAt)}${
        latest.endedAt ? ` → ${fmtClock(latest.endedAt)}` : ''
      } · idle`,
      emptyTitle: 'no combat yet',
      emptySub: 'step into a fight in-game and the group will populate here.',
      showAge: false,
    };
  }
  // Nothing ever happened — fall back to raw player list
  return {
    rows: Object.entries(state.players).map(([name, p]) => ({
      name,
      amount: p.amount,
      duration: p.duration,
      updatedAt: p.updatedAt,
    })),
    heading: undefined,
    emptyTitle: 'No parses yet',
    emptySub: "Once you (or anyone in your room) deals damage, they'll appear here in real time.",
    showAge: true,
  };
}

function EncounterBar({ state }: { state: AppState }) {
  if (!state.history.length && !state.currentEncounter) return null;

  return (
    <div className="encounter-bar">
      <button
        className={`enc-pill ${state.selectedEncounterId === undefined ? 'enc-pill-active' : ''}`}
        onClick={() => window.tumba.selectEncounter(undefined)}
      >
        live
      </button>
      {state.history.map(enc => (
        <button
          key={enc.id}
          className={`enc-pill ${state.selectedEncounterId === enc.id ? 'enc-pill-active' : ''}`}
          onClick={() => window.tumba.selectEncounter(enc.id)}
          title={`${fmtClock(enc.startedAt)}${enc.endedAt ? ` → ${fmtClock(enc.endedAt)}` : ''}`}
        >
          #{enc.id}
        </button>
      ))}
    </div>
  );
}
