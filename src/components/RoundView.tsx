import { useTournament } from '../context/TournamentContext';
import TableCard from './TableCard';

export default function RoundView() {
  const { state, dispatch } = useTournament();
  const roundIndex = state.currentRound - 1;
  const currentRound = state.rounds[roundIndex];
  const isLastRound = state.currentRound >= state.totalRounds;

  const allPositionsEntered = currentRound.tables.every(table =>
    table.players.every(p => p.position !== null)
  );

  const handleAdvance = () => {
    if (isLastRound) {
      dispatch({ type: 'COMPLETE_TOURNAMENT' });
    } else {
      dispatch({ type: 'NEXT_ROUND' });
    }
  };

  return (
    <div className="round-view">
      <div className="round-header">
        <h2>Round {state.currentRound} of {state.totalRounds}</h2>
      </div>

      <div className="tables-grid">
        {currentRound.tables.map((table, i) => (
          <TableCard
            key={table.id}
            table={table}
            tableIndex={i}
            roundIndex={roundIndex}
            disabled={currentRound.completed}
          />
        ))}
      </div>

      <button
        className="btn-primary btn-advance"
        onClick={handleAdvance}
        disabled={!allPositionsEntered}
      >
        {isLastRound ? 'Finish Tournament' : 'Next Round'}
      </button>
    </div>
  );
}
