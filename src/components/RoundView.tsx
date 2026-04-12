import { useTournament } from '../context/TournamentContext';
import TableCard from './TableCard';

interface Props {
  viewingRoundIndex: number;
  setViewingRoundIndex: (index: number) => void;
}

export default function RoundView({ viewingRoundIndex, setViewingRoundIndex }: Props) {
  const { state, dispatch } = useTournament();
  const latestRoundIndex = state.currentRound - 1;

  const viewingRound = state.rounds[viewingRoundIndex];
  const isViewingLatest = viewingRoundIndex === latestRoundIndex;
  const isLastRound = state.currentRound >= state.totalRounds;

  const allPositionsEntered = viewingRound.tables.every(table =>
    table.players.every(p => p.position !== null)
  );

  const handleAdvance = () => {
    if (isLastRound) {
      dispatch({ type: 'COMPLETE_TOURNAMENT' });
    } else {
      dispatch({ type: 'NEXT_ROUND' });
      setViewingRoundIndex(latestRoundIndex + 1);
    }
  };

  return (
    <div className="round-view">
      <div className="round-header">
        <div className="round-nav">
          <button
            className="round-nav-btn"
            onClick={() => setViewingRoundIndex(viewingRoundIndex - 1)}
            disabled={viewingRoundIndex === 0}
            title="Previous round"
          >
            &#8249;
          </button>
          <h2>
            Round {viewingRoundIndex + 1} of {state.totalRounds}
            {!isViewingLatest && <span className="round-editing-badge">editing</span>}
          </h2>
          <button
            className="round-nav-btn"
            onClick={() => setViewingRoundIndex(viewingRoundIndex + 1)}
            disabled={viewingRoundIndex === latestRoundIndex}
            title="Next round"
          >
            &#8250;
          </button>
        </div>
        <div className="round-progress">
          {Array.from({ length: state.totalRounds }, (_, i) => (
            <div
              key={i}
              className={`round-progress-step ${
                i < state.currentRound ? 'completed' : ''
              } ${i === viewingRoundIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="tables-grid">
        {viewingRound.tables.map((table, i) => (
          <TableCard
            key={table.id}
            table={table}
            tableIndex={i}
            roundIndex={viewingRoundIndex}
            disabled={false}
          />
        ))}
      </div>

      {isViewingLatest && (
        <button
          className="btn-primary btn-advance"
          onClick={handleAdvance}
          disabled={!allPositionsEntered}
        >
          {isLastRound ? 'Finish Tournament' : 'Next Round'}
        </button>
      )}

      <button
        className="btn-danger-outline btn-reset-tournament"
        onClick={() => {
          if (window.confirm('Are you sure you want to reset the tournament? All progress will be lost.')) {
            dispatch({ type: 'RESET_TOURNAMENT' });
          }
        }}
      >
        Reset Tournament
      </button>
    </div>
  );
}
