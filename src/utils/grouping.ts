import type { GameTable, StandingEntry } from '../types';

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function computeGroupSizes(playerCount: number): number[] {
  const k = Math.floor(playerCount / 4);
  const remainder = playerCount % 4;

  switch (remainder) {
    case 0:
      return Array(k).fill(4);
    case 1:
      // (k-1) groups of 4 + 1 group of 5
      return [...Array(Math.max(0, k - 1)).fill(4), 5];
    case 2:
      // (k-1) groups of 4 + 2 groups of 3
      return [...Array(Math.max(0, k - 1)).fill(4), ...Array(2).fill(3)];
    case 3:
      // k groups of 4 + 1 group of 3
      return [...Array(k).fill(4), 3];
    default:
      return [];
  }
}

export function canFormValidGroups(count: number): boolean {
  return count >= 3;
}

export function createGroups(
  playerIds: string[],
  mode: 'random' | 'swiss',
  standings?: StandingEntry[]
): GameTable[] {
  let ordered: string[];

  if (mode === 'random') {
    ordered = shuffle(playerIds);
  } else {
    // Swiss: sort by points descending, randomize ties
    const standingsMap = new Map(standings?.map(s => [s.playerId, s.totalPoints]) ?? []);
    const withPoints = playerIds.map(id => ({ id, points: standingsMap.get(id) ?? 0 }));

    // Group by points, shuffle within each group, then flatten
    const pointGroups = new Map<number, string[]>();
    for (const p of withPoints) {
      if (!pointGroups.has(p.points)) pointGroups.set(p.points, []);
      pointGroups.get(p.points)!.push(p.id);
    }

    const sortedKeys = [...pointGroups.keys()].sort((a, b) => b - a);
    ordered = sortedKeys.flatMap(key => shuffle(pointGroups.get(key)!));
  }

  const sizes = computeGroupSizes(ordered.length);
  const tables: GameTable[] = [];
  let index = 0;

  for (const size of sizes) {
    const tablePlayers = ordered.slice(index, index + size).map(playerId => ({
      playerId,
      position: null,
    }));
    tables.push({
      id: crypto.randomUUID(),
      players: tablePlayers,
    });
    index += size;
  }

  return tables;
}
