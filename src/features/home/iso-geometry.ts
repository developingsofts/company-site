// A slab seen in isometric view. Its top face is a rounded square, `side`
// units across, drawn flat (u to the right, v down, origin at the back
// corner) and projected so that u runs down-right and v down-left.

const side = 100;
const radius = 10;
const thickness = 20;
const cos30 = Math.cos(Math.PI / 6);
// How far in from a corner's square edge the arc's outermost point sits.
const inset = radius * (1 - Math.SQRT1_2);

/** Projects the flat top face onto the screen; art drawn in flat units goes inside it. */
export const isoMatrix = `matrix(${cos30} 0.5 ${-cos30} 0.5 0 0)`;

export function project(u: number, v: number): [number, number] {
  return [(u - v) * cos30, (u + v) / 2];
}

const r = radius;
const s = side;

/** The rounded square in flat units: under `isoMatrix` the top face, shifted down by `thickness` the bottom one. */
export const facePath = `M${r} 0H${s - r}A${r} ${r} 0 0 1 ${s} ${r}V${s - r}A${r} ${r} 0 0 1 ${s - r} ${s}H${r}A${r} ${r} 0 0 1 0 ${s - r}V${r}A${r} ${r} 0 0 1 ${r} 0Z`;

/** The bottom face's front half in flat units, from the right silhouette edge round to the left one. */
export const frontEdgePath = `M${s - inset} ${inset}A${r} ${r} 0 0 1 ${s} ${r}V${s - r}A${r} ${r} 0 0 1 ${s - r} ${s}H${r}A${r} ${r} 0 0 1 ${inset} ${s - inset}`;

const right = project(s - inset, inset);
const left = project(inset, s - inset);
const front = project(s - inset, s - inset);

export const slabThickness = thickness;

/** The vertical edges on screen: both silhouette sides and the front corner. */
export const sideEdges = [left, front, right].map(([x, y]) => ({ x, top: y, bottom: y + thickness }));

/** The band between the top and bottom faces, on screen, so a fill leaves no gap at the sides. */
export const sideBand = { x: left[0], y: left[1], width: right[0] - left[0], height: thickness };

const pad = 1.5;
const top = project(inset, inset)[1];
const bottom = front[1] + thickness;

export const blockViewBox = [left[0] - pad, top - pad, right[0] - left[0] + 2 * pad, bottom - top + 2 * pad] as const;

/** Width over height of the whole slab, padding included. */
export const blockAspect = blockViewBox[2] / blockViewBox[3];
