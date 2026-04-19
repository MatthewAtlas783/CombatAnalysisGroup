import { app, BrowserWindow, Tray, Menu, nativeImage, shell } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Service } from './service.js';
import { registerIpc } from './ipc.js';
import { getSettings } from './settings.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow: BrowserWindow | undefined;
let tray: Tray | undefined;
let isQuitting = false;
const service = new Service();

function resolveIcon(): Electron.NativeImage {
  // electron-vite copies resources/ to out/main/../resources at build time;
  // also try the source path during dev.
  const candidates = [
    path.join(__dirname, '..', '..', 'resources', 'tray-icon.png'),
    path.join(__dirname, '..', '..', '..', 'resources', 'tray-icon.png'),
    path.join(process.resourcesPath, 'tray-icon.png'),
  ];
  for (const p of candidates) {
    try {
      const img = nativeImage.createFromPath(p);
      if (!img.isEmpty()) return img;
    } catch {
      /* try next */
    }
  }
  // Fallback: tiny 16x16 transparent PNG so Tray() doesn't crash
  return nativeImage.createFromBuffer(Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAA1JREFUCNdjYBgFwwAAAUgAAVBzNW4AAAAASUVORK5CYII=',
    'base64',
  ));
}

function createWindow(): void {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show();
    mainWindow.focus();
    return;
  }
  const settings = getSettings();
  mainWindow = new BrowserWindow({
    width: 720,
    height: 540,
    minWidth: 480,
    minHeight: 360,
    backgroundColor: '#0e1116',
    title: 'TumbaAnalysis',
    autoHideMenuBar: true,
    show: !settings.startMinimized,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'index.mjs'),
      contextIsolation: true,
      sandbox: false,
      nodeIntegration: false,
    },
  });

  mainWindow.on('close', e => {
    if (!isQuitting) {
      e.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: 'deny' };
  });

  if (process.env.ELECTRON_RENDERER_URL) {
    void mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    void mainWindow.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
  }
}

function createTray(): void {
  tray = new Tray(resolveIcon());
  tray.setToolTip('TumbaAnalysis');
  const menu = Menu.buildFromTemplate([
    { label: 'Show window', click: () => createWindow() },
    { label: 'Reconnect relay', click: () => service.reconnect() },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(menu);
  tray.on('click', () => createWindow());
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => createWindow());

  app.whenReady().then(() => {
    registerIpc(service);
    service.start();
    createTray();
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
      else mainWindow?.show();
    });
  });

  app.on('before-quit', () => {
    isQuitting = true;
    service.shutdown();
  });

  // Don't quit on window close — we live in the tray
  app.on('window-all-closed', () => {
    /* keep running */
  });
}
