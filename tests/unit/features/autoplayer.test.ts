import { describe, expect, it } from "vitest";
import { type Game, type Piece, autoplayer, newGame, step } from "@/features/tetris";

const dice = (...values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length];
};

describe("autoplayer", () => {
  it("once out of patience, stands an I upright in a one-column well and clears four lines", () => {
    const cols = 10;
    const rows = 13;
    const board = new Uint8Array(cols * rows);
    for (let y = rows - 4; y < rows; y++) board.fill(1, y * cols, y * cols + cols - 1);

    const piece: Piece = { kind: "I", rotation: 0, x: 3, y: -2, age: 0 };
    const start = { ...newGame(cols, rows, 1), board, piece, sinceClear: 20 };
    let game: Game = { ...start, plan: autoplayer(start, dice(0.99, 0.5)) };
    while (game.placed === 0) game = step(game, autoplayer);

    expect([...game.clearing].sort((a, b) => a - b)).toEqual([9, 10, 11, 12]);
  });

  it("improvises on an open board: different dice, different landings", () => {
    const piece: Piece = { kind: "T", rotation: 0, x: 4, y: -2, age: 0 };
    const start = { ...newGame(12, 12, 1), piece };
    const landings = new Set(
      [0, 0.2, 0.4, 0.6, 0.8, 0.99].map((d) => {
        const plan = autoplayer(start, dice(d, 0));
        return `${plan.rotation}/${plan.x}`;
      }),
    );
    expect(landings.size).toBeGreaterThan(2);
  });

  it("drifts a while before steering when the dice say so, and still reaches its landing", () => {
    const piece: Piece = { kind: "T", rotation: 0, x: 4, y: -2, age: 0 };
    const start = { ...newGame(12, 12, 1), piece };
    expect(autoplayer(start, dice(0.5, 0)).wait).toBe(0);
    expect(autoplayer(start, dice(0.5, 0.99)).wait).toBeGreaterThan(0);
  });

  // However it improvises, rows keep completing.
  for (const [cols, rows] of [
    [10, 11],
    [23, 9],
  ]) {
    it(`keeps completing rows on a ${cols}×${rows} board, whatever the seed`, () => {
      for (const seed of [3, 41, 977]) {
        let game = newGame(cols, rows, seed);
        let completed = 0;
        let drought = 0;
        let longest = 0;
        while (game.placed < 250) {
          const before = game;
          game = step(game, autoplayer);
          if (game.placed === before.placed) continue;
          // A top-out dissolves rows too, but not full ones: it doesn't count
          // as completing a row, and the game starts over from an empty board.
          const full = game.clearing.filter((y) => game.board.subarray(y * cols, (y + 1) * cols).every((v) => v === 1));
          if (full.length > 0) {
            completed += full.length;
            drought = 0;
          } else if (game.clearing.length > 0) {
            drought = 0;
          } else {
            longest = Math.max(longest, ++drought);
          }
        }
        // A row takes at least cols/4 pieces to fill.
        expect(completed).toBeGreaterThan(250 / cols);
        expect(longest).toBeLessThan(40);
      }
    });
  }
});
