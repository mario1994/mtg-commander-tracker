import { useTournament } from '../context/TournamentContext';
import { calculateStandings } from '../utils/scoring';

export default function Standings() {
  const { state } = useTournament();

  const completedRounds = state.rounds.filter(r => r.completed);
  const standings = calculateStandings(completedRounds, state.players);

  return (
    <aside className="standings-sidebar">
      <h3>Standings</h3>
      {standings.length === 0 ? (
        <p className="standings-empty">No rounds completed yet.</p>
      ) : (
        <table className="standings-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((entry, index) => (
              <tr key={entry.playerId}>
                <td>{index + 1}</td>
                <td>{entry.nickname}</td>
                <td>{entry.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </aside>
  );
}
