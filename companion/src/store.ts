import { useEffect, useState } from 'react';
import type { RelayStatus } from './relay.js';

export type LogLevel = 'info' | 'warn' | 'error';

export type State = {
  relayStatus: RelayStatus;
  relayDetail: string | undefined;
  reconnectAt: number | undefined;
  room: string | undefined;
  joined: boolean;
  player: string | undefined;
  local: { amount: number; duration: number; updatedAt: number } | undefined;
  players: Record<string, { amount: number; duration: number; updatedAt: number }>;
  outputPath: string | undefined;
  inputPath: string | undefined;
  log: { ts: number; level: LogLevel; message: string }[];
};

const initial: State = {
  relayStatus: 'idle',
  relayDetail: undefined,
  reconnectAt: undefined,
  room: undefined,
  joined: false,
  player: undefined,
  local: undefined,
  players: {},
  outputPath: undefined,
  inputPath: undefined,
  log: [],
};

class Store {
  state: State = initial;
  private listeners = new Set<() => void>();

  get(): State { return this.state; }

  set(patch: Partial<State> | ((s: State) => Partial<State>)): void {
    const upd = typeof patch === 'function' ? patch(this.state) : patch;
    this.state = { ...this.state, ...upd };
    for (const l of this.listeners) l();
  }

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => { this.listeners.delete(fn); };
  }

  log(level: LogLevel, message: string): void {
    this.set(s => ({
      log: [...s.log.slice(-49), { ts: Date.now(), level, message }],
    }));
  }
}

export const store = new Store();

export function useStore<T>(selector: (s: State) => T): T {
  const [value, setValue] = useState(() => selector(store.get()));
  useEffect(() => {
    const update = () => setValue(selector(store.get()));
    update();
    return store.subscribe(update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return value;
}
