import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import { STORAGE_KEY } from '../constants';
import type { TournamentAction, TournamentState } from '../types';
import { canFormValidGroups, createGroups } from '../utils/grouping';
import { calculateStandings } from '../utils/scoring';

const initialState: TournamentState = {
  phase: 'setup',
  players: [],
  totalRounds: 3,
  currentRound: 0,
  rounds: [],
};

function reducer(state: TournamentState, action: TournamentAction): TournamentState {
  switch (action.type) {
    case 'ADD_PLAYER':
      return {
        ...state,
        players: [...state.players, { id: crypto.randomUUID(), nickname: action.nickname, active: true }],
      };

    case 'EDIT_PLAYER':
      return {
        ...state,
        players: state.players.map(p => (p.id === action.id ? { ...p, nickname: action.nickname } : p)),
      };

    case 'REMOVE_PLAYER':
      return {
        ...state,
        players: state.players.filter(p => p.id !== action.id),
      };

    case 'SET_ROUNDS':
      return { ...state, totalRounds: action.totalRounds };

    case 'TOGGLE_PLAYER_ACTIVE': {
      const player = state.players.find(p => p.id === action.playerId);
      if (!player) return state;
      // If deactivating, check remaining active count is valid
      if (player.active) {
        const remainingActive = state.players.filter(p => p.active && p.id !== action.playerId).length;
        if (!canFormValidGroups(remainingActive)) return state;
      }
      return {
        ...state,
        players: state.players.map(p =>
          p.id === action.playerId ? { ...p, active: !p.active } : p
        ),
      };
    }

    case 'START_TOURNAMENT': {
      const playerIds = state.players.filter(p => p.active).map(p => p.id);
      const tables = createGroups(playerIds, 'random');
      return {
        ...state,
        phase: 'playing',
        currentRound: 1,
        rounds: [{ roundNumber: 1, tables, completed: false }],
      };
    }

    case 'SET_POSITION': {
      const rounds = state.rounds.map((round, ri) => {
        if (ri !== action.roundIndex) return round;
        return {
          ...round,
          tables: round.tables.map(table => {
            if (table.id !== action.tableId) return table;
            return {
              ...table,
              players: table.players.map(p =>
                p.playerId === action.playerId ? { ...p, position: action.position } : p
              ),
            };
          }),
        };
      });
      return { ...state, rounds };
    }

    case 'NEXT_ROUND': {
      // Mark current round as completed
      const completedRounds = state.rounds.map((round, i) =>
        i === state.currentRound - 1 ? { ...round, completed: true } : round
      );

      const standings = calculateStandings(completedRounds, state.players);
      const playerIds = state.players.filter(p => p.active).map(p => p.id);
      const nextRoundNum = state.currentRound + 1;
      const tables = createGroups(playerIds, 'swiss', standings);

      return {
        ...state,
        rounds: [...completedRounds, { roundNumber: nextRoundNum, tables, completed: false }],
        currentRound: nextRoundNum,
      };
    }

    case 'COMPLETE_TOURNAMENT': {
      const completedRounds = state.rounds.map((round, i) =>
        i === state.currentRound - 1 ? { ...round, completed: true } : round
      );
      return { ...state, phase: 'complete', rounds: completedRounds };
    }

    case 'RESET_TOURNAMENT':
      localStorage.removeItem(STORAGE_KEY);
      return initialState;

    case 'LOAD_STATE':
      return action.state;

    default:
      return state;
  }
}

const TournamentContext = createContext<{
  state: TournamentState;
  dispatch: React.Dispatch<TournamentAction>;
} | null>(null);

export function TournamentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as TournamentState;
        // Migrate old saves: default active=true for players missing the field
        parsed.players = parsed.players.map(p => ({ active: true, ...p }));
        return parsed;
      } catch {
        return initialState;
      }
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <TournamentContext.Provider value={{ state, dispatch }}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const ctx = useContext(TournamentContext);
  if (!ctx) throw new Error('useTournament must be used within TournamentProvider');
  return ctx;
}
