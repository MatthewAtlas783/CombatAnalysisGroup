import { ipcMain, BrowserWindow } from 'electron';
import { Service, type AppState } from './service.js';
import { getSettings, updateSettings, type Settings } from './settings.js';

export function registerIpc(service: Service): void {
  ipcMain.handle('state:get', (): AppState => service.getState());
  ipcMain.handle('settings:get', (): Settings => getSettings());
  ipcMain.handle('settings:update', (_e, patch: Partial<Settings>): Settings => {
    const next = updateSettings(patch);
    service.applySettings();
    return next;
  });
  ipcMain.on('action:reconnect', () => service.reconnect());
  ipcMain.on('action:selectEncounter', (_e, id: number | undefined) => {
    service.selectEncounter(id);
  });

  service.on('state', (state: AppState) => {
    for (const win of BrowserWindow.getAllWindows()) {
      if (!win.isDestroyed()) win.webContents.send('state:update', state);
    }
  });
}
