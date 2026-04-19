export type ClientMessage =
  | { type: 'join'; room: string; player: string }
  | { type: 'stats'; player: string; amount: number; duration: number }
  | { type: 'leave' };

export type ServerMessage =
  | { type: 'joined'; room: string }
  | { type: 'snapshot'; players: Record<string, PlayerSnapshot> }
  | { type: 'error'; message: string };

export type PlayerSnapshot = {
  amount: number;
  duration: number;
  updatedAt: number;
};
