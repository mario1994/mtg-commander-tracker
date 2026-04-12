import { useTournament } from '../context/TournamentContext';
import { calculateStandings } from '../utils/scoring';

export default function TournamentComplete() {
  const { state, dispatch } = useTournament();
  const standings = calculateStandings(state.rounds, state.players);

  const getPlayerActive = (playerId: string) =>
    state.players.find(p => p.id === playerId)?.active ?? true;

  return (
    <div className="complete-container">
      <h1>Tournament Complete!</h1>

      {standings.length >= 3 && (
        <div className="podium">
          <div className="podium-place podium-2">
            <div className="podium-avatar">{standings[1].nickname.charAt(0).toUpperCase()}</div>
            <span className="podium-name">{standings[1].nickname}</span>
            <span className="podium-points">{standings[1].totalPoints} pts</span>
            <div className="podium-bar"></div>
          </div>
          <div className="podium-place podium-1">
            <div className="podium-crown">&#9813;</div>
            <div className="podium-avatar">{standings[0].nickname.charAt(0).toUpperCase()}</div>
            <span className="podium-name">{standings[0].nickname}</span>
            <span className="podium-points">{standings[0].totalPoints} pts</span>
            <div className="podium-bar"></div>
          </div>
          <div className="podium-place podium-3">
            <div className="podium-avatar">{standings[2].nickname.charAt(0).toUpperCase()}</div>
            <span className="podium-name">{standings[2].nickname}</span>
            <span className="podium-points">{standings[2].totalPoints} pts</span>
            <div className="podium-bar"></div>
          </div>
        </div>
      )}

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
            {standings.map((entry, index) => {
              const active = getPlayerActive(entry.playerId);
              return (
                <tr
                  key={entry.playerId}
                  className={`${index < 3 ? `rank-${index + 1}` : ''} ${active ? '' : 'player-inactive'}`}
                >
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button className="btn-primary btn-reset" onClick={() => dispatch({ type: 'RESET_TOURNAMENT' })}>
        New Tournament
      </button>
    </div>
  );
}
