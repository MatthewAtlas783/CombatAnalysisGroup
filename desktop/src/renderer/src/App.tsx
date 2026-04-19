import { useEffect, useState } from 'react';
import type { AppState } from '../../main/service.js';
import type { Settings } from '../../main/settings.js';
import { StatusBar } from './StatusBar.js';
import { Roster } from './Roster.js';
import { SettingsPanel } from './Settings.js';

const initialState: AppState = {
  relayStatus: 'idle',
  relayDetail: undefined,
  reconnectAt: undefined,
  joined: false,
  room: '',
  player: '',
  inputPath: undefined,
  outputPath: undefined,
  account: undefined,
  local: undefined,
  players: {},
  bootError: undefined,
};

export function App() {
  const [state, setState] = useState<AppState>(initialState);
  const [settings, setSettings] = useState<Settings | undefined>(undefined);
  const [showSettings, setShowSettings] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    void window.tumba.getState().then(setState);
    void window.tumba.getSettings().then(setSettings);
    const off = window.tumba.onStateUpdate(setState);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      off();
      clearInterval(tick);
    };
  }, []);

  const onSave = async (patch: Partial<Settings>) => {
    const next = await window.tumba.updateSettings(patch);
    setSettings(next);
    setShowSettings(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-name">TumbaAnalysis</span>
          <span className="brand-sub">live group parses</span>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={() => window.tumba.reconnect()}>
            reconnect
          </button>
          <button className="btn btn-ghost" onClick={() => setShowSettings(s => !s)}>
            {showSettings ? 'close' : 'settings'}
          </button>
        </div>
      </header>

      <StatusBar state={state} now={now} />

      {state.bootError && (
        <div className="boot-error">
          <strong>cannot start:</strong> {state.bootError}
          <div className="boot-error-hint">
            Open settings to set a custom plugindata folder or LOTRO account.
          </div>
        </div>
      )}

      <main className="app-main">
        {showSettings && settings ? (
          <SettingsPanel
            settings={settings}
            onSave={onSave}
            onCancel={() => setShowSettings(false)}
          />
        ) : (
          <Roster state={state} now={now} />
        )}
      </main>
    </div>
  );
}
