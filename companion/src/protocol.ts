export type LocalStats = {
  player: string;
  amount: number;
  duration: number;
};

export type ClientMessage =
  | { type: 'join'; room: string; player: string }
  | { type: 'stats'; player: string; amount: number; duration: number }
  | { type: 'leave' };

export type ServerMessage =
  | { type: 'joined'; room: string }
  | { type: 'snapshot'; players: Record<string, { amount: number; duration: number; updatedAt: number }> }
  | { type: 'error'; message: string };
