export interface Player {
  id: string;
  nickname: string;
}

export interface TableResult {
  playerId: string;
  position: number | null;
}

export interface GameTable {
  id: string;
  players: TableResult[];
}

export interface Round {
  roundNumber: number;
  tables: GameTable[];
  completed: boolean;
}

export interface StandingEntry {
  playerId: string;
  nickname: string;
  totalPoints: number;
  buchholz: number;
  omw: number;
}

export interface TournamentState {
  phase: 'setup' | 'playing' | 'complete';
  players: Player[];
  totalRounds: number;
  currentRound: number;
  rounds: Round[];
}

export type TournamentAction =
  | { type: 'ADD_PLAYER'; nickname: string }
  | { type: 'EDIT_PLAYER'; id: string; nickname: string }
  | { type: 'REMOVE_PLAYER'; id: string }
  | { type: 'SET_ROUNDS'; totalRounds: number }
  | { type: 'START_TOURNAMENT' }
  | { type: 'SET_POSITION'; roundIndex: number; tableId: string; playerId: string; position: number | null }
  | { type: 'NEXT_ROUND' }
  | { type: 'COMPLETE_TOURNAMENT' }
  | { type: 'RESET_TOURNAMENT' }
  | { type: 'LOAD_STATE'; state: TournamentState };
