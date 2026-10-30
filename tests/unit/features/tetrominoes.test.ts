import { describe, expect, it } from "vitest";
import { boxSize, kinds, rotations } from "@/features/tetris";

const key = (cells: readonly (readonly [number, number])[]) =>
  cells
    .map(([x, y]) => `${x},${y}`)
    .sort()
    .join(" ");

describe("tetrominoes", () => {
  it("gives every piece four rotations of four distinct cells", () => {
    for (const kind of kinds) {
      expect(rotations[kind]).toHaveLength(4);
      for (const cells of rotations[kind]) {
        expect(new Set(cells.map(([x, y]) => `${x},${y}`)).size).toBe(4);
      }
    }
  });

  // The board draws a piece in its first state turned about its box's centre;
  // that only lands on the right cells if every state is exactly that.
  it("makes every rotation state the first one turned about the box's centre", () => {
    for (const kind of kinds) {
      const n = boxSize[kind];
      for (let r = 0; r < 4; r++) {
        let cells = rotations[kind][0];
        // A quarter turn clockwise of the cell square [x, x+1]×[y, y+1] about
        // (n/2, n/2) is the cell square at (n - 1 - y, x).
        for (let i = 0; i < r; i++) cells = cells.map(([x, y]) => [n - 1 - y, x] as const);
        expect(key(cells)).toBe(key(rotations[kind][r]));
      }
    }
  });
});
