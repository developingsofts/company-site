import { describe, expect, it } from "vitest";
import { opening, openingRows } from "@/features/tetris";

describe("opening", () => {
  it("starts on a low stack, a game a few pieces in", () => {
    for (const [cols, rows] of [
      [23, 10],
      [10, 11],
    ]) {
      for (let seed = 0; seed < 40; seed++) {
        const game = opening(cols, rows, seed * 7919);
        const top = game.board.indexOf(1);
        expect(top).toBeGreaterThanOrEqual(0);
        expect(rows - Math.floor(top / cols)).toBeLessThanOrEqual(openingRows);
        expect(game.piece).toBeNull();
      }
    }
  });
});
