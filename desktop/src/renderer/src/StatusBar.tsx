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
  if (diff < 60) return diff + 's';
  const m = Math.floor(diff / 60);
  return m + 'm' + (diff % 60) + 's';
}

export function StatusBar({ state, now }: { state: AppState; now: number }) {
  const status = state.relayStatus;
  const reconnectIn = state.reconnectAt
    ? Math.max(0, Math.round((state.reconnectAt - now) / 1000))
    : undefined;

  return (
    <section className="status-bar">
      <div className="status-row">
        <span className="status-label">relay</span>
        <span className={`status-dot status-${status}`} />
        <span className="status-value">{STATUS_LABEL[status] ?? status}</span>
        {status === 'reconnecting' && reconnectIn !== undefined && (
          <span className="status-hint">retry in {reconnectIn}s</span>
        )}
        {state.relayDetail && status !== 'connected' && (
          <span className="status-error">{state.relayDetail}</span>
        )}
      </div>

      <div className="status-row">
        <span className="status-label">room</span>
        <span className="status-value">{state.room || '—'}</span>
        {state.room && (
          <span className="status-hint">{state.joined ? 'joined' : 'pending'}</span>
        )}
      </div>

      <div className="status-row">
        <span className="status-label">you</span>
        {state.player ? (
          <>
            <span className="status-value">{state.player}</span>
            {state.local ? (
              <span className="status-hint">
                {fmtNumber(state.local.amount)} dmg · last update{' '}
                {fmtRelative(state.local.updatedAt, now)} ago
              </span>
            ) : (
              <span className="status-hint">waiting for plugin to publish stats</span>
            )}
          </>
        ) : (
          <span className="status-hint">
            character unknown — load TumbaAnalysis in-game and step into combat once
          </span>
        )}
      </div>

      {state.account && (
        <div className="status-row">
          <span className="status-label">account</span>
          <span className="status-value">{state.account}</span>
        </div>
      )}
    </section>
  );
}
