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
  | {
      type: 'encounterDetail';
      player: string;
      seq: number;
      duration: number;
      total: number;
      attacks: number;
      mobs: MobBreakdown[];
    }
  | { type: 'leave' };

export type SkillBreakdown = {
  amount: number;
  attacks: number;
  max: number;
  min: number;
  crits: number;
  devs: number;
};

export type MobBreakdown = {
  name: string;
  duration: number;
  total: number;
  attacks: number;
  skills: Record<string, SkillBreakdown>;
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
  mobs?: MobBreakdown[];
  detailSeq?: number;
};

export type EncounterSummary = {
  id: number;
  startedAt: number;
  endedAt: number | undefined;
  players: Record<string, EncounterPlayer>;
};
