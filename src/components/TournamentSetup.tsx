import { useTournament } from '../context/TournamentContext';
import { MIN_PLAYERS } from '../constants';
import PlayerInput from './PlayerInput';
import PlayerList from './PlayerList';

export default function TournamentSetup() {
  const { state, dispatch } = useTournament();
  const playerCount = state.players.length;
  const canStart = playerCount >= MIN_PLAYERS && state.totalRounds >= 1;

  const getValidationMessage = () => {
    if (playerCount < MIN_PLAYERS) return `Need at least ${MIN_PLAYERS} players to start.`;
    return null;
  };

  const validationMsg = getValidationMessage();

  return (
    <div className="setup-container">
      <div className="setup-hero">
        <div className="setup-hero-glow"></div>
        <h1>Commander Tournament</h1>
        <p className="subtitle">Magic: The Gathering</p>
      </div>

      <section className="setup-section">
        <div className="section-header">
          <span className="step-indicator">1</span>
          <h2>Players ({playerCount})</h2>
        </div>
        <PlayerInput />
        <PlayerList />
        {validationMsg && <p className="validation-msg">{validationMsg}</p>}
      </section>

      <section className="setup-section">
        <div className="section-header">
          <span className="step-indicator">2</span>
          <h2>Rounds</h2>
        </div>
        <div className="rounds-config">
          <label htmlFor="rounds">Number of rounds:</label>
          <input
            id="rounds"
            type="number"
            min={1}
            max={10}
            value={state.totalRounds}
            onChange={e => dispatch({ type: 'SET_ROUNDS', totalRounds: Math.max(1, parseInt(e.target.value) || 1) })}
          />
        </div>
      </section>

      <button className="btn-primary btn-start" onClick={() => dispatch({ type: 'START_TOURNAMENT' })} disabled={!canStart}>
        Start Tournament
      </button>
    </div>
  );
}
