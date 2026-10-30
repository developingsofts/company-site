// A fan of curves in a 100 × 100 box: one end of each spread down the box's
// outer edge, the other gathered to a single point mid-way down its inner
// edge. Things that flow along a fan travel from 0 at the outer edge to 1 at
// the point.

export type Point = [number, number];
type Curve = [Point, Point, Point, Point];

export const fanFocus: Point = [100, 50];

/** `count` curves from the left edge, top to bottom, all ending at `fanFocus`. */
export function fanCurves(count: number): Curve[] {
  return Array.from({ length: count }, (_, i) => {
    const y = 2 + (96 * i) / Math.max(1, count - 1);
    return [
      [0, y],
      [45, y],
      [70, 50 + (y - 50) * 0.25],
      fanFocus,
    ];
  });
}

export function pointOn([p0, p1, p2, p3]: Curve, t: number): Point {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
}

export function curvePath([p0, p1, p2, p3]: Curve): string {
  return `M${p0[0]} ${p0[1]}C${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]}`;
}

const golden = 0.618034;
const frac = (n: number) => n - Math.floor(n);

/** Seconds a token takes to run the length of a fan, before its own variation. */
const crossing = 7;

/**
 * Where token `index` of a stream is at `time` seconds: which curve it rides,
 * how far along it is, and how many times it has come round, so it can show
 * something new each lap. Tokens start spread along their curves, so a still
 * frame already reads as a stream.
 */
export function tokenAt(index: number, time: number, curves: number) {
  const pace = 1 / (crossing * (0.8 + 0.4 * frac(index * 0.37)));
  const run = frac(index * golden) + time * pace;
  return { curve: (index * 7) % curves, t: frac(run), lap: Math.floor(run) };
}

/** A token's opacity: it fades in off the outer edge and out into the point. */
export function tokenOpacity(t: number): number {
  return Math.min(1, t / 0.12, (1 - t) / 0.2);
}

const hex = "0123456789abcdef";

/** The digit token `index` carries on lap `lap`. */
export function tokenDigit(index: number, lap: number): string {
  return hex[(index * 7 + lap * 5) % 16];
}
