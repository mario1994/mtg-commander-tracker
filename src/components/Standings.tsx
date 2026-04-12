import { useTournament } from '../context/TournamentContext';
import { canFormValidGroups } from '../utils/grouping';
import { calculateStandings } from '../utils/scoring';

interface Props {
  viewingRoundIndex: number;
  setViewingRoundIndex: (index: number) => void;
}

export default function Standings({ viewingRoundIndex, setViewingRoundIndex }: Props) {
  const { state, dispatch } = useTournament();
  const isPlaying = state.phase === 'playing';
  const latestRoundIndex = state.currentRound - 1;
  const isViewingPastRound = viewingRoundIndex < latestRoundIndex;

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

  const handleToggle = (playerId: string) => {
    if (isViewingPastRound) {
      const player = state.players.find(p => p.id === playerId);
      const isDeactivating = player?.active ?? false;
      const verb = isDeactivating ? 'excluded from' : 'included in';
      const ok = window.confirm(
        `This will regenerate round ${viewingRoundIndex + 2} onward with this player ${verb} the lineup. Continue?`
      );
      if (!ok) return;
      dispatch({ type: 'TOGGLE_PLAYER_ACTIVE', playerId, regenerateFromRoundIndex: viewingRoundIndex });
      setViewingRoundIndex(viewingRoundIndex + 1);
    } else {
      dispatch({ type: 'TOGGLE_PLAYER_ACTIVE', playerId });
    }
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
                  <td>
                    <span className={`rank-badge ${index < 3 ? `rank-${index + 1}` : ''}`}>
                      {index + 1}
                    </span>
                  </td>
                  <td>{entry.nickname}</td>
                  <td>{entry.totalPoints}</td>
                  <td title={`SoS (Buchholz): ${entry.buchholz}`}>
                    {Math.round(entry.omw * 100)}%
                  </td>
                  {isPlaying && (
                    <td>
                      <button
                        className={`toggle-active ${active ? 'active' : 'inactive'}`}
                        onClick={() => handleToggle(entry.playerId)}
                        disabled={active && !canDeactivate(entry.playerId)}
                        title={
                          isViewingPastRound
                            ? active
                              ? 'Deactivate & regenerate next rounds'
                              : 'Reactivate & regenerate next rounds'
                            : active
                              ? 'Deactivate player'
                              : 'Reactivate player'
                        }
                      >
                        {active ? 'Drop' : 'Add'}
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {isPlaying && isViewingPastRound && (
        <p className="standings-regen-hint">
          Toggling a player here will regenerate subsequent rounds.
        </p>
      )}
    </aside>
  );
}
