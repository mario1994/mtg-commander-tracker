import { useState } from 'react';
import { useTournament } from '../context/TournamentContext';

export default function PlayerList() {
  const { state, dispatch } = useTournament();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEdit = (id: string, current: string) => {
    setEditingId(id);
    setEditValue(current);
  };

  const saveEdit = () => {
    if (editingId && editValue.trim()) {
      dispatch({ type: 'EDIT_PLAYER', id: editingId, nickname: editValue.trim() });
    }
    setEditingId(null);
    setEditValue('');
  };

  if (state.players.length === 0) {
    return <p className="empty-state">No players added yet.</p>;
  }

  return (
    <ul className="player-list">
      {state.players.map((player, index) => (
        <li key={player.id} className="player-item">
          <span className="player-number">{index + 1}.</span>
          {editingId === player.id ? (
            <input
              type="text"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveEdit()}
              onBlur={saveEdit}
              autoFocus
            />
          ) : (
            <span className="player-name">{player.nickname}</span>
          )}
          <div className="player-actions">
            {editingId !== player.id && (
              <button className="btn-icon" onClick={() => startEdit(player.id, player.nickname)} title="Edit">
                &#9998;
              </button>
            )}
            <button className="btn-icon btn-danger" onClick={() => dispatch({ type: 'REMOVE_PLAYER', id: player.id })} title="Remove">
              &times;
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
