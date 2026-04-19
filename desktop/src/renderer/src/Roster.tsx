import { useState } from 'react';
import type { AppState } from '../../main/service.js';
import type { EncounterSummary, MobBreakdown } from '../../main/protocol.js';

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
  mobs: MobBreakdown[] | undefined;
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
  const [expanded, setExpanded] = useState<string | undefined>(undefined);

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
            const isExpanded = expanded === row.name;
            const hasDetail = !!(row.mobs && row.mobs.length > 0);
            const rowClass = [
              'roster-row',
              isMe ? 'me' : '',
              row.online ? '' : 'offline',
              hasDetail ? 'expandable' : '',
              isExpanded ? 'expanded' : '',
            ].filter(Boolean).join(' ');
            return (
              <div key={row.name} className="roster-row-wrap">
                <div
                  className={rowClass}
                  onClick={hasDetail ? () => setExpanded(isExpanded ? undefined : row.name) : undefined}
                  title={hasDetail ? 'click for per-target breakdown' : undefined}
                >
                  <div className="roster-bar" style={{ width: pct + '%' }} />
                  <div className="roster-cells">
                    <span className="col col-rank">{idx + 1}</span>
                    <span className="col col-player">
                      {hasDetail && (
                        <span className="drill-caret">{isExpanded ? '▾' : '▸'}</span>
                      )}
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
                {isExpanded && row.mobs && (
                  <PlayerBreakdown mobs={row.mobs} />
                )}
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
          mobs: p.mobs,
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
        mobs: p.mobs,
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
  // Idle on the Live tab — explicitly zero the view so the user can tell at a
  // glance that nothing is tracking. Previously we'd fall back to the latest
  // history entry here, which made stale numbers look like a live parse.
  // Past fights are still reachable via the numbered pills.
  const hasHistory = state.history.length > 0;
  return {
    rows: [],
    title: 'Live encounter',
    subtitle: hasHistory ? 'idle · waiting for next fight' : undefined,
    totalAmount: 0,
    totalDuration: 0,
    showAge: false,
    isEmpty: true,
    emptyTitle: hasHistory ? 'idle' : 'No parses yet',
    emptySub: hasHistory
      ? 'waiting for next encounter — pick a numbered pill to review past fights.'
      : 'Once you (or anyone in your room) deals damage, an encounter will appear here.',
  };
}

function PlayerBreakdown({ mobs }: { mobs: MobBreakdown[] }) {
  const sortedMobs = mobs.slice().sort((a, b) => b.total - a.total);
  const [activeMob, setActiveMob] = useState<string>(sortedMobs[0]?.name ?? '');
  const mob = sortedMobs.find(m => m.name === activeMob) ?? sortedMobs[0];
  if (!mob) return null;
  const skills = Object.entries(mob.skills).sort((a, b) => b[1].amount - a[1].amount);
  const topSkill = skills[0]?.[1].amount ?? 1;

  return (
    <div className="breakdown">
      <div className="breakdown-tabs">
        {sortedMobs.map(m => (
          <button
            key={m.name}
            className={`breakdown-tab ${m.name === mob.name ? 'active' : ''}`}
            onClick={() => setActiveMob(m.name)}
            title={`${fmtNumber(m.total)} dmg · ${m.attacks} hits · ${fmtDuration(m.duration)}`}
          >
            <span className="bt-name">{m.name}</span>
            <span className="bt-total">{fmtNumber(m.total)}</span>
          </button>
        ))}
      </div>
      <div className="breakdown-mob-meta">
        <span>{mob.attacks} hits</span>
        <span>·</span>
        <span>{fmtDuration(mob.duration)}</span>
        <span>·</span>
        <span>{fmtRate(mob.total, mob.duration)} dps</span>
      </div>
      {skills.length === 0 ? (
        <div className="breakdown-empty">no per-skill data</div>
      ) : (
        <div className="skill-table">
          <div className="skill-row skill-head">
            <span className="sc sc-name">skill</span>
            <span className="sc sc-amount">dmg</span>
            <span className="sc sc-attacks">hits</span>
            <span className="sc sc-max">max</span>
            <span className="sc sc-crit">crit%</span>
          </div>
          {skills.map(([skillName, s]) => {
            const pct = Math.max(2, Math.min(100, (s.amount / topSkill) * 100));
            const critPct = s.attacks > 0 ? Math.round(((s.crits + s.devs) / s.attacks) * 100) : 0;
            return (
              <div key={skillName} className="skill-row">
                <div className="skill-bar" style={{ width: pct + '%' }} />
                <span className="sc sc-name">{skillName}</span>
                <span className="sc sc-amount">{fmtNumber(s.amount)}</span>
                <span className="sc sc-attacks">{s.attacks}</span>
                <span className="sc sc-max">{fmtNumber(s.max)}</span>
                <span className="sc sc-crit">{critPct}%</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
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
