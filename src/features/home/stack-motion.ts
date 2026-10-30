// Progress through the services stage is measured in stage widths scrolled
// past the moment it arrived: below 0 it is still sliding in, from 0 to its
// dwell it holds still while the blocks keep stacking.

/** Where the first block lands, how far apart the rest land, and how long each flies for. */
const timing = { firstLanding: 0, spacing: 0.35, flight: 0.3 };
/** Stage widths left to scroll after the last block lands, before the chapter moves on. */
const rest = 0.25;

/** Block heights between one level of the stack and the next. */
const levelStep = 0.26;
/** How many levels show under the top block before older ones sink away. */
const levelsBelow = 2;
/** Block widths a block flies in from, on the left. */
const reach = 0.7;
/** Block heights a block falls through as it lands. */
const drop = 0.35;
/** Block widths a block slides right as it is cleared away. */
const clearShift = 0.25;

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** How far, in stage widths, the stage holds still for `count` blocks to land. */
export function dwellFor(count: number): number {
  return timing.firstLanding + Math.max(0, count - 1) * timing.spacing + rest;
}

/** How far block `index` has flown in at `progress`: 0 not yet started, 1 landed. */
export function flightOf(progress: number, index: number): number {
  const lands = timing.firstLanding + index * timing.spacing;
  return easeOut(clamp01((progress - lands + timing.flight) / timing.flight));
}

export function flightsAt(progress: number, count: number): number[] {
  return Array.from({ length: count }, (_, i) => flightOf(progress, i));
}

/** How many blocks are at least half way in. */
export function landedCount(progress: number, count: number): number {
  return flightsAt(progress, count).filter((f) => f >= 0.5).length;
}

/**
 * One block's look. `x` is in block widths and `y` in block heights from the
 * stack's base; `fill`, `ink` and `ghost` are the opacities of its solid body,
 * its drawing and its bare outline.
 */
export interface BlockPose {
  x: number;
  y: number;
  opacity: number;
  fill: number;
  ink: number;
  ghost: number;
}

/**
 * Where block `index` sits while the scroll builds the stack. The top block is
 * solid; the one under it turns translucent, the next a bare outline, and any
 * older ones sink and fade, so the stack never outgrows its corner. `still`
 * drops the flight, for reduced motion: blocks fade in where they land.
 */
export function stackPose(flights: readonly number[], index: number, still: boolean): BlockPose {
  const flown = flights[index];
  const stacked = flights.reduce((sum, f) => sum + f, 0);
  // 0 for the top block, 1 for the one under it; below 0 while still flying in.
  const depth = stacked - 1 - index;
  const top = Math.min(Math.max(stacked - 1, 0), levelsBelow);
  const travel = still ? 0 : 1 - flown;
  return {
    x: 0 - reach * travel,
    y: (depth - top) * levelStep - drop * travel,
    opacity: clamp01(flown * 2.5) * (1 - clamp01(depth - levelsBelow)),
    fill: depth <= 1 ? lerp(1, 0.4, clamp01(depth)) : lerp(0.4, 0, clamp01(depth - 1)),
    ink: 1 - clamp01(depth),
    ghost: clamp01(depth),
  };
}

const alone: BlockPose = { x: 0, y: 0, opacity: 1, fill: 1, ink: 1, ghost: 0 };

function blend(a: BlockPose, b: BlockPose, t: number): BlockPose {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    opacity: lerp(a.opacity, b.opacity, t),
    fill: lerp(a.fill, b.fill, t),
    ink: lerp(a.ink, b.ink, t),
    ghost: lerp(a.ghost, b.ghost, t),
  };
}

/**
 * The stack pose, pulled towards a single block shown on its own. `away` is
 * how far this block has been cleared off the stack, `solo` how far it has
 * settled alone at the base. Each block runs its own pair, so the one picked
 * goes straight from the stack to the base without passing through the
 * cleared pose, and never dims on the way; the rest slide off to the right
 * and fade.
 */
export function isolatedPose(stack: BlockPose, solo: number, away: number): BlockPose {
  const cleared = { ...stack, x: Math.max(stack.x, 0) + clearShift, opacity: 0 };
  return blend(blend(stack, cleared, away), alone, solo);
}
