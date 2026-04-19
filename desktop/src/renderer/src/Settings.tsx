import { useState } from 'react';
import type { Settings } from '../../main/settings.js';

export function SettingsPanel({
  settings,
  onSave,
  onCancel,
}: {
  settings: Settings;
  onSave: (patch: Partial<Settings>) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<Settings>(settings);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setDraft(d => ({ ...d, [key]: value }));

  return (
    <form
      className="settings"
      onSubmit={e => {
        e.preventDefault();
        onSave(draft);
      }}
    >
      <Field label="Room" hint="Share this with your raid. Same room = same parses.">
        <input
          type="text"
          value={draft.room}
          onChange={e => set('room', e.target.value)}
          placeholder="lobby"
        />
      </Field>

      <Field
        label="Character override"
        hint="Leave blank to auto-detect from the plugin. Useful if you swap characters mid-session."
      >
        <input
          type="text"
          value={draft.playerOverride}
          onChange={e => set('playerOverride', e.target.value)}
          placeholder="auto"
        />
      </Field>

      <Field label="Relay URL" hint="Defaults to the hosted relay. Override for local dev.">
        <input
          type="text"
          value={draft.relayUrl}
          onChange={e => set('relayUrl', e.target.value)}
        />
      </Field>

      <Field
        label="Plugindata folder"
        hint="Leave blank to auto-detect (Documents or OneDrive). Override if your install lives elsewhere."
      >
        <input
          type="text"
          value={draft.pluginDataDir}
          onChange={e => set('pluginDataDir', e.target.value)}
          placeholder="auto"
          spellCheck={false}
        />
      </Field>

      <Field
        label="LOTRO account"
        hint="Leave blank to auto-pick the account that has TumbaAnalysis data."
      >
        <input
          type="text"
          value={draft.account}
          onChange={e => set('account', e.target.value)}
          placeholder="auto"
        />
      </Field>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={draft.startMinimized}
          onChange={e => set('startMinimized', e.target.checked)}
        />
        <span>Start minimized to tray</span>
      </label>

      <div className="settings-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          cancel
        </button>
        <button type="submit" className="btn btn-primary">
          save &amp; reconnect
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      {children}
      {hint && <div className="field-hint">{hint}</div>}
    </div>
  );
}
