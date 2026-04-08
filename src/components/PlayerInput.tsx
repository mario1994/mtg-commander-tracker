import { useState } from 'react';
import { useTournament } from '../context/TournamentContext';

export default function PlayerInput() {
  const { dispatch } = useTournament();
  const [nickname, setNickname] = useState('');

  const handleAdd = () => {
    const trimmed = nickname.trim();
    if (!trimmed) return;
    dispatch({ type: 'ADD_PLAYER', nickname: trimmed });
    setNickname('');
  };

  return (
    <div className="player-input">
      <input
        type="text"
        placeholder="Enter player nickname..."
        value={nickname}
        onChange={e => setNickname(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleAdd()}
      />
      <button onClick={handleAdd} disabled={!nickname.trim()}>
        Add Player
      </button>
    </div>
  );
}
