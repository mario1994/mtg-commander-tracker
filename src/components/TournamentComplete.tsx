import { useTournament } from '../context/TournamentContext';
import { calculateStandings } from '../utils/scoring';

export default function TournamentComplete() {
  const { state, dispatch } = useTournament();
  const standings = calculateStandings(state.rounds, state.players);

  return (
    <div className="complete-container">
      <h1>Tournament Complete!</h1>

      <div className="final-standings">
        <h2>Final Standings</h2>
        <table className="standings-table final">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Points</th>
              <th title="Opponent Match Win %">OMW%</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((entry, index) => (
              <tr key={entry.playerId} className={index < 3 ? `rank-${index + 1}` : ''}>
                <td>{index + 1}</td>
                <td>{entry.nickname}</td>
                <td>{entry.totalPoints}</td>
                <td title={`SoS (Buchholz): ${entry.buchholz}`}>
                  {Math.round(entry.omw * 100)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn-primary btn-reset" onClick={() => dispatch({ type: 'RESET_TOURNAMENT' })}>
        New Tournament
      </button>
    </div>
  );
}
