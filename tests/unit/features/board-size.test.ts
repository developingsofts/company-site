import { describe, expect, it } from "vitest";
import { boardSize } from "@/features/tetris";

describe("boardSize", () => {
  it("spans the width exactly with square cells between 40 and 64px", () => {
    for (const [width, height] of [
      [390, 460],
      [768, 500],
      [1440, 580],
      [2560, 900],
    ]) {
      const size = boardSize(width, height)!;
      const cell = width / size.cols;
      expect(cell).toBeGreaterThanOrEqual(40 * 0.9);
      expect(cell).toBeLessThanOrEqual(64 * 1.1);
      expect(size.visibleRows * cell).toBeCloseTo(height);
      expect(size.rows).toBe(Math.ceil(size.visibleRows));
    }
  });

  it("gives a phone about ten columns and a desktop a little over twenty", () => {
    expect(boardSize(390, 460)!.cols).toBe(10);
    expect(boardSize(1440, 580)!.cols).toBe(23);
  });

  it("has no board for a box too small to turn a piece in", () => {
    expect(boardSize(0, 400)).toBeNull();
    expect(boardSize(800, 100)).toBeNull();
  });
});
