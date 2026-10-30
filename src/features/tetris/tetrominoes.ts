export type Kind = "I" | "O" | "T" | "S" | "Z" | "J" | "L";

export type Cell = readonly [x: number, y: number];

export const kinds: readonly Kind[] = ["I", "O", "T", "S", "Z", "J", "L"];

const shapes: Record<Kind, readonly string[]> = {
  I: ["....", "####", "....", "...."],
  O: ["##", "##"],
  T: [".#.", "###", "..."],
  S: [".##", "##.", "..."],
  Z: ["##.", ".##", "..."],
  J: ["#..", "###", "..."],
  L: ["..#", "###", "..."],
};

function parse(rows: readonly string[]): Cell[] {
  return rows.flatMap((row, y) => [...row].flatMap((ch, x) => (ch === "#" ? [[x, y] as const] : [])));
}

/** A quarter turn clockwise inside the piece's n×n box. */
function turn(cells: readonly Cell[], n: number): Cell[] {
  return cells.map(([x, y]) => [n - 1 - y, x] as const);
}

function allRotations(kind: Kind): readonly (readonly Cell[])[] {
  const n = shapes[kind].length;
  const first = parse(shapes[kind]);
  const out = [first];
  for (let i = 1; i < 4; i++) out.push(turn(out[i - 1], n));
  return out;
}

/** Each piece's four rotation states, as cells inside its box. */
export const rotations = Object.fromEntries(kinds.map((k) => [k, allRotations(k)])) as Record<
  Kind,
  readonly (readonly Cell[])[]
>;

/**
 * The side of each piece's square box, in cells. Each rotation state is the
 * one before turned a quarter clockwise about the box's centre, so a piece
 * can be drawn in its first state and rotated there.
 */
export const boxSize = Object.fromEntries(kinds.map((k) => [k, shapes[k].length])) as Record<Kind, number>;
