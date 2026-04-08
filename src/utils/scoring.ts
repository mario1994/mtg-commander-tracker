import { POINTS } from '../constants';
import type { GameTable, Player, Round, StandingEntry } from '../types';

export function calculateTablePoints(table: GameTable): Map<string, number> {
  const results = new Map<string, number>();

  const byPosition = new Map<number, string[]>();
  for (const p of table.players) {
    if (p.position === null) continue;
    if (!byPosition.has(p.position)) byPosition.set(p.position, []);
    byPosition.get(p.position)!.push(p.playerId);
  }

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

/**
 * Build a map of playerId -> Set of opponent playerIds they faced across all completed rounds.
 */
function buildOpponentMap(rounds: Round[]): Map<string, Set<string>> {
  const opponents = new Map<string, Set<string>>();

  for (const round of rounds) {
    if (!round.completed) continue;
    for (const table of round.tables) {
      const playerIds = table.players.map(p => p.playerId);
      for (const pid of playerIds) {
        if (!opponents.has(pid)) opponents.set(pid, new Set());
        for (const other of playerIds) {
          if (other !== pid) opponents.get(pid)!.add(other);
        }
      }
    }
  }

  return opponents;
}

/**
 * For head-to-head: build a map of "playerA vs playerB" -> who placed higher.
 * Returns a map where key = `${pidA}:${pidB}` (sorted) and value = the pid who won.
 * If they never shared a table or tied, no entry.
 */
function buildHeadToHeadMap(rounds: Round[]): Map<string, string | null> {
  const h2h = new Map<string, string | null>();

  for (const round of rounds) {
    if (!round.completed) continue;
    for (const table of round.tables) {
      const players = table.players.filter(p => p.position !== null);
      for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
          const a = players[i];
          const b = players[j];
          const key = [a.playerId, b.playerId].sort().join(':');

          if (a.position! < b.position!) {
            // a placed higher (lower position number = better)
            h2h.set(key, a.playerId);
          } else if (b.position! < a.position!) {
            h2h.set(key, b.playerId);
          } else {
            // Tied at same position -- no h2h winner
            h2h.set(key, null);
          }
        }
      }
    }
  }

  return h2h;
}

export function calculateStandings(rounds: Round[], players: Player[]): StandingEntry[] {
  // 1. Calculate total points per player
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

  // 2. Build opponent map
  const opponentMap = buildOpponentMap(rounds);

  // 3. Calculate Buchholz: sum of all opponents' total points
  const buchholzMap = new Map<string, number>();
  for (const player of players) {
    const opponents = opponentMap.get(player.id) ?? new Set();
    let buchholz = 0;
    for (const oppId of opponents) {
      buchholz += pointsMap.get(oppId) ?? 0;
    }
    buchholzMap.set(player.id, buchholz);
  }

  // 4. Calculate OMW%: average of opponents' win percentages (floored at 33%)
  // Win% for multiplayer = total points / max possible points
  const completedRoundCount = rounds.filter(r => r.completed).length;
  const maxPossiblePoints = completedRoundCount * POINTS[0]; // max points per round = 4 (1st place)

  const omwMap = new Map<string, number>();
  for (const player of players) {
    const opponents = opponentMap.get(player.id) ?? new Set();
    if (opponents.size === 0 || maxPossiblePoints === 0) {
      omwMap.set(player.id, 0);
      continue;
    }
    let totalOppWinPct = 0;
    for (const oppId of opponents) {
      const oppPoints = pointsMap.get(oppId) ?? 0;
      const oppWinPct = Math.max(oppPoints / maxPossiblePoints, 0.33);
      totalOppWinPct += oppWinPct;
    }
    omwMap.set(player.id, totalOppWinPct / opponents.size);
  }

  // 5. Build head-to-head map for final tiebreaker
  const h2hMap = buildHeadToHeadMap(rounds);

  // 6. Assemble standings
  const standings: StandingEntry[] = players.map(p => ({
    playerId: p.id,
    nickname: p.nickname,
    totalPoints: pointsMap.get(p.id) ?? 0,
    buchholz: buchholzMap.get(p.id) ?? 0,
    omw: omwMap.get(p.id) ?? 0,
  }));

  // 7. Sort with cascading tiebreakers:
  //    Points -> Buchholz -> OMW% -> Head-to-head
  standings.sort((a, b) => {
    // Primary: total points (higher is better)
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;

    // Secondary: Buchholz score (higher is better)
    if (b.buchholz !== a.buchholz) return b.buchholz - a.buchholz;

    // Tertiary: Opponent Match Win % (higher is better)
    if (b.omw !== a.omw) return b.omw - a.omw;

    // Quaternary: Head-to-head between these two players
    const key = [a.playerId, b.playerId].sort().join(':');
    const winner = h2hMap.get(key);
    if (winner === a.playerId) return -1;
    if (winner === b.playerId) return 1;

    return 0;
  });

  return standings;
}
