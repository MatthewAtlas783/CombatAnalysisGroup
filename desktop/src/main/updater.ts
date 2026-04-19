import { app, dialog, shell } from 'electron';
import electronUpdater from 'electron-updater';
import { getSettings } from './settings.js';

const { autoUpdater } = electronUpdater;

let initialized = false;
let manualCheckInProgress = false;

export function initAutoUpdater(): void {
  if (initialized) return;
  initialized = true;

  // Dev builds aren't packaged — skip entirely so we don't spam logs.
  if (!app.isPackaged) return;

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('update-downloaded', info => {
    if (manualCheckInProgress) {
      manualCheckInProgress = false;
      void dialog
        .showMessageBox({
          type: 'info',
          buttons: ['Restart now', 'Later'],
          defaultId: 0,
          cancelId: 1,
          title: 'Update ready',
          message: `TumbaAnalysis ${info.version} downloaded.`,
          detail: 'Restart now to install, or it will install automatically when you next quit.',
        })
        .then(result => {
          if (result.response === 0) autoUpdater.quitAndInstall();
        });
    }
  });

  autoUpdater.on('error', err => {
    if (!manualCheckInProgress) return;
    manualCheckInProgress = false;
    void dialog.showMessageBox({
      type: 'error',
      buttons: ['OK'],
      title: 'Update check failed',
      message: 'Could not check for updates.',
      detail: err?.message ?? String(err),
    });
  });

  // Background polling is OFF by default so end-user installs don't silently
  // upgrade. Opt in by setting `autoUpdateEnabled: true` in
  // %APPDATA%/TumbaAnalysis/settings.json on the dev machine. Manual
  // "Check for updates…" from the tray still works regardless of this flag.
  if (!getSettings().autoUpdateEnabled) return;

  void autoUpdater.checkForUpdates().catch(() => {});
  setInterval(() => {
    void autoUpdater.checkForUpdates().catch(() => {});
  }, 4 * 60 * 60 * 1000);
}

export async function checkForUpdatesManual(): Promise<void> {
  if (!app.isPackaged) {
    void dialog.showMessageBox({
      type: 'info',
      buttons: ['OK'],
      title: 'Dev build',
      message: 'Auto-update is disabled in development.',
    });
    return;
  }
  if (manualCheckInProgress) return;
  manualCheckInProgress = true;
  try {
    const result = await autoUpdater.checkForUpdates();
    if (!result || !result.updateInfo || result.updateInfo.version === app.getVersion()) {
      manualCheckInProgress = false;
      void dialog.showMessageBox({
        type: 'info',
        buttons: ['OK'],
        title: 'Up to date',
        message: `You're running the latest version (${app.getVersion()}).`,
      });
    }
    // Otherwise the 'update-downloaded' handler will prompt to restart.
  } catch (err) {
    manualCheckInProgress = false;
    void dialog.showMessageBox({
      type: 'error',
      buttons: ['View releases', 'OK'],
      defaultId: 1,
      title: 'Update check failed',
      message: 'Could not check for updates.',
      detail: err instanceof Error ? err.message : String(err),
    }).then(r => {
      if (r.response === 0) {
        void shell.openExternal('https://github.com/MatthewAtlas783/CombatAnalysisGroup/releases');
      }
    });
  }
}
