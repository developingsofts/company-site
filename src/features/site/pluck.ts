export interface Pluck {
  grabbed: boolean;
  /** Where the curve's control point goes while grabbed, in the strip's px. */
  control: { x: number; y: number };
}

// The control point of a quadratic curve pulls the curve only halfway to
// itself; overshooting the pointer makes the line bend to meet it.
const reach = 2.2;

/**
 * Whether a horizontal line across a `width`×`height` strip is held by a
 * pointer at `x`,`y` (relative to the strip), and where it is pulled. It is
 * caught within `grab` px of the line and let go past `release` px or outside
 * the strip.
 */
export function pluck(
  x: number,
  y: number,
  width: number,
  height: number,
  grabbed: boolean,
  grab: number,
  release: number,
): Pluck {
  const mid = height / 2;
  const control = { x, y: mid + reach * (y - mid) };
  if (x < 0 || x > width || y < 0 || y > height) return { grabbed: false, control };
  const distance = Math.abs(y - mid);
  if (!grabbed) return { grabbed: distance < grab, control };
  return { grabbed: distance <= Math.min(release, mid), control };
}
