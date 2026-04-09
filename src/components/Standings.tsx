import { useTournament } from '../context/TournamentContext';
import { canFormValidGroups } from '../utils/grouping';
import { calculateStandings } from '../utils/scoring';

export default function Standings() {
  const { state, dispatch } = useTournament();
  const isPlaying = state.phase === 'playing';

  const completedRounds = state.rounds.filter(r => r.completed);
  const standings = calculateStandings(completedRounds, state.players);

  const activeCount = state.players.filter(p => p.active).length;

  const getPlayerActive = (playerId: string) =>
    state.players.find(p => p.id === playerId)?.active ?? true;

  const canDeactivate = (playerId: string) => {
    const player = state.players.find(p => p.id === playerId);
    if (!player?.active) return true; // can always reactivate
    return canFormValidGroups(activeCount - 1);
  };

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
              <th title="Opponent Match Win %">OMW%</th>
              {isPlaying && <th></th>}
            </tr>
          </thead>
          <tbody>
            {standings.map((entry, index) => {
              const active = getPlayerActive(entry.playerId);
              return (
                <tr key={entry.playerId} className={active ? '' : 'player-inactive'}>
                  <td>{index + 1}</td>
                  <td>{entry.nickname}</td>
                  <td>{entry.totalPoints}</td>
                  <td title={`SoS (Buchholz): ${entry.buchholz}`}>
                    {Math.round(entry.omw * 100)}%
                  </td>
                  {isPlaying && (
                    <td>
                      <button
                        className={`toggle-active ${active ? 'active' : 'inactive'}`}
                        onClick={() => dispatch({ type: 'TOGGLE_PLAYER_ACTIVE', playerId: entry.playerId })}
                        disabled={active && !canDeactivate(entry.playerId)}
                        title={active ? 'Deactivate player' : 'Reactivate player'}
                      >
                        {active ? '✕' : '↩'}
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </aside>
  );
}
