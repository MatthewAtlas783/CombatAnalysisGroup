import type { AppState } from '../main/service.js';
import type { Settings } from '../main/settings.js';

declare global {
  interface Window {
    tumba: {
      getState: () => Promise<AppState>;
      getSettings: () => Promise<Settings>;
      updateSettings: (patch: Partial<Settings>) => Promise<Settings>;
      reconnect: () => void;
      selectEncounter: (id: number | undefined) => void;
      onStateUpdate: (listener: (state: AppState) => void) => () => void;
    };
  }
}

export {};
