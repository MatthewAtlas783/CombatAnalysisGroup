import type { AppState } from '../../main/service.js';

const STATUS_LABEL: Record<string, string> = {
  idle: 'idle',
  connecting: 'connecting',
  connected: 'connected',
  reconnecting: 'reconnecting',
  closed: 'closed',
};

function fmtNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'k';
  return Math.round(n).toString();
}

function fmtRelative(ts: number, now: number): string {
  const diff = Math.max(0, Math.round((now - ts) / 1000));
  if (diff < 5) return 'just now';
  if (diff < 60) return diff + 's ago';
  const m = Math.floor(diff / 60);
  return m + 'm' + (diff % 60).toString().padStart(2, '0') + 's ago';
}

export function StatusBar({ state, now }: { state: AppState; now: number }) {
  const status = state.relayStatus;
  const reconnectIn = state.reconnectAt
    ? Math.max(0, Math.round((state.reconnectAt - now) / 1000))
    : undefined;

  const showError = state.relayDetail && status !== 'connected';

  return (
    <section className="status-bar">
      <div className="status-line">
        <span className="status-chunk">
          <span className={`status-dot status-${status}`} />
          <span className="status-value">{STATUS_LABEL[status] ?? status}</span>
          {status === 'reconnecting' && reconnectIn !== undefined && (
            <span className="status-hint">· retry {reconnectIn}s</span>
          )}
        </span>

        <span className="status-sep" aria-hidden>·</span>

        <span className="status-chunk">
          <span className="status-dim">room</span>
          <span className="status-value">{state.room || '—'}</span>
          {state.room && !state.joined && (
            <span className="status-hint">(pending)</span>
          )}
        </span>

        {state.joined && (
          <>
            <span className="status-sep" aria-hidden>·</span>
            <span
              className={`combat-pill ${state.roomInCombat ? 'combat-pill-active' : 'combat-pill-idle'}`}
            >
              {state.roomInCombat ? 'in combat' : 'idle'}
            </span>
          </>
        )}
      </div>

      <div className="status-line status-line-sub">
        {state.player ? (
          <>
            <span className="status-chunk">
              <span className="status-dim">you</span>
              <span className="status-value">{state.player}</span>
            </span>
            {state.local && (
              <>
                <span className="status-sep" aria-hidden>·</span>
                <span className="status-chunk">
                  <span className="status-value">{fmtNumber(state.local.amount)} dmg</span>
                  <span className="status-hint">{fmtRelative(state.local.updatedAt, now)}</span>
                </span>
              </>
            )}
            {!state.local && (
              <span className="status-hint">waiting for plugin to publish stats</span>
            )}
          </>
        ) : (
          <span className="status-hint">
            no character yet — load TumbaAnalysis in-game and step into combat once
          </span>
        )}
      </div>

      {showError && (
        <div className="status-line">
          <span className="status-error">{state.relayDetail}</span>
        </div>
      )}
    </section>
  );
}
