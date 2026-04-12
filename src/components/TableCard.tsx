import { useTournament } from '../context/TournamentContext';
import type { GameTable } from '../types';

interface Props {
  table: GameTable;
  tableIndex: number;
  roundIndex: number;
  disabled: boolean;
}

export default function TableCard({ table, tableIndex, roundIndex, disabled }: Props) {
  const { state, dispatch } = useTournament();
  const maxPosition = table.players.length;

  const getPlayerName = (playerId: string) =>
    state.players.find(p => p.id === playerId)?.nickname ?? 'Unknown';

  return (
    <div className="table-card">
      <div className="table-card-header">
        <span className="table-number-badge">{tableIndex + 1}</span>
        <h3>Table {tableIndex + 1}</h3>
      </div>
      <div className="table-players">
        {table.players.map(result => (
          <div
            key={result.playerId}
            className={`table-player-row ${result.position ? `position-${result.position}` : ''}`}
          >
            <span className="table-player-name">{getPlayerName(result.playerId)}</span>
            <select
              value={result.position ?? ''}
              disabled={disabled}
              onChange={e => {
                const val = e.target.value;
                dispatch({
                  type: 'SET_POSITION',
                  roundIndex,
                  tableId: table.id,
                  playerId: result.playerId,
                  position: val === '' ? null : parseInt(val),
                });
              }}
            >
              <option value="">--</option>
              {Array.from({ length: maxPosition }, (_, i) => i + 1).map(pos => (
                <option key={pos} value={pos}>
                  {pos === 1 ? '1st' : pos === 2 ? '2nd' : pos === 3 ? '3rd' : `${pos}th`}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
