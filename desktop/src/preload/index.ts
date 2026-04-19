import { contextBridge, ipcRenderer } from 'electron';

const api = {
  getState: () => ipcRenderer.invoke('state:get'),
  getSettings: () => ipcRenderer.invoke('settings:get'),
  updateSettings: (patch: Record<string, unknown>) => ipcRenderer.invoke('settings:update', patch),
  reconnect: () => ipcRenderer.send('action:reconnect'),
  selectEncounter: (id: number | undefined) =>
    ipcRenderer.send('action:selectEncounter', id),
  onStateUpdate: (listener: (state: unknown) => void) => {
    const handler = (_e: Electron.IpcRendererEvent, state: unknown) => listener(state);
    ipcRenderer.on('state:update', handler);
    return () => ipcRenderer.removeListener('state:update', handler);
  },
};

contextBridge.exposeInMainWorld('tumba', api);
