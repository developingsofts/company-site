/**
 * mulberry32: a tiny seeded generator. Returns a number in [0, 1) and the seed
 * for the next draw, so a game is replayable from its seed: tests can pin it.
 */
export function random(seed: number): [value: number, seed: number] {
  const next = (seed + 0x6d2b79f5) | 0;
  let t = next;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return [((t ^ (t >>> 14)) >>> 0) / 4294967296, next];
}
