import { POINTS } from '../constants';
import type { GameTable, Player, Round, StandingEntry } from '../types';

export function calculateTablePoints(table: GameTable): Map<string, number> {
  const results = new Map<string, number>();

  // Group players by their assigned position
  const byPosition = new Map<number, string[]>();
  for (const p of table.players) {
    if (p.position === null) continue;
    if (!byPosition.has(p.position)) byPosition.set(p.position, []);
    byPosition.get(p.position)!.push(p.playerId);
  }

  // For each position group, calculate split points
  const sortedPositions = [...byPosition.keys()].sort((a, b) => a - b);
  let slotIndex = 0;

  for (const pos of sortedPositions) {
    const tiedPlayers = byPosition.get(pos)!;
    const count = tiedPlayers.length;
    let totalPts = 0;
    for (let i = 0; i < count; i++) {
      totalPts += POINTS[slotIndex + i] ?? 0;
    }
    const splitPts = totalPts / count;
    for (const pid of tiedPlayers) {
      results.set(pid, splitPts);
    }
    slotIndex += count;
  }

  return results;
}

export function calculateStandings(rounds: Round[], players: Player[]): StandingEntry[] {
  const pointsMap = new Map<string, number>();

  for (const player of players) {
    pointsMap.set(player.id, 0);
  }

  for (const round of rounds) {
    if (!round.completed) continue;
    for (const table of round.tables) {
      const tablePoints = calculateTablePoints(table);
      for (const [playerId, pts] of tablePoints) {
        pointsMap.set(playerId, (pointsMap.get(playerId) ?? 0) + pts);
      }
    }
  }

  const standings: StandingEntry[] = players.map(p => ({
    playerId: p.id,
    nickname: p.nickname,
    totalPoints: pointsMap.get(p.id) ?? 0,
  }));

  standings.sort((a, b) => b.totalPoints - a.totalPoints);
  return standings;
}
