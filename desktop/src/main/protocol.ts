export type LocalStats = {
  player: string;
  amount: number;
  duration: number;
  attacks: number;
  inCombat: boolean;
};

export type ClientMessage =
  | { type: 'join'; room: string; player: string }
  | {
      type: 'stats';
      player: string;
      amount: number;
      duration: number;
      attacks: number;
      inCombat: boolean;
    }
  | { type: 'leave' };

export type PlayerSnapshot = {
  amount: number;
  duration: number;
  attacks: number;
  updatedAt: number;
  inCombat: boolean;
  online: boolean;
};

export type EncounterPlayer = {
  amount: number;
  duration: number;
  attacks: number;
};

export type EncounterSummary = {
  id: number;
  startedAt: number;
  endedAt: number | undefined;
  players: Record<string, EncounterPlayer>;
};

export type ServerMessage =
  | { type: 'joined'; room: string }
  | {
      type: 'snapshot';
      players: Record<string, PlayerSnapshot>;
      roomInCombat: boolean;
      current: EncounterSummary | undefined;
      history: EncounterSummary[];
    }
  | { type: 'error'; message: string };
