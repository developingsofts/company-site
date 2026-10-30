import { describe, expect, it } from "vitest";
import { type Game, autoplayer, cellsOf, dissolveTicks, newGame, removeRows, step } from "@/features/tetris";

const cols = 6;
const rows = 5;

function boardOf(lines: string[]): Uint8Array {
  return Uint8Array.from(lines.join("").split(""), (c) => (c === "#" ? 1 : 0));
}

describe("removeRows", () => {
  it("drops the rows above each removed row", () => {
    const board = boardOf(["......", "#.....", "##....", "######", "###..."]);
    expect(removeRows({ cols, rows, board }, [3])).toEqual(
      boardOf(["......", "......", "#.....", "##....", "###..."]),
    );
  });
});

describe("step", () => {
  it("spawns the next piece above the board", () => {
    const game = step(newGame(10, 13, 1), autoplayer);
    expect(game.piece).not.toBeNull();
    for (const [, y] of cellsOf(game.piece!)) expect(y).toBeLessThan(0);
  });

  it("holds a completed row while it dissolves, then removes it and drops the rest", () => {
    let game: Game = {
      ...newGame(cols, rows, 1),
      board: boardOf(["......", "......", "......", "#.....", "....##"]),
      // A flat I lying in the gap of the bottom row.
      piece: { kind: "I", rotation: 0, x: 0, y: rows - 2, age: 0 },
      plan: { rotation: 0, x: 0, wait: 0 },
    };
    while (game.placed === 0) game = step(game, autoplayer);
    expect(game.clearing).toEqual([rows - 1]);
    expect(game.piece).toBeNull();
    // Spreads from the middle of the I, columns 0–3.
    expect(game.clearFrom).toBe(2);

    let held = 0;
    while (game.clearing.length > 0) {
      expect(game.board).toEqual(boardOf(["......", "......", "......", "#.....", "######"]));
      held++;
      game = step(game, autoplayer);
    }
    expect(held).toBe(dissolveTicks);
    expect(game.board).toEqual(boardOf(["......", "......", "......", "......", "#....."]));
  });

  it("dissolves the whole stack and starts over when a piece locks above the top", () => {
    // Only two lone gaps near the top: no piece fits under the ceiling.
    const stack = boardOf(["###.##", "##.###", "#####.", "######", "#####."]);
    let game: Game = { ...newGame(cols, rows, 1), board: stack };
    while (game.placed === 0) game = step(game, autoplayer);
    expect(game.clearing).toEqual([0, 1, 2, 3, 4]);
    expect(game.board).toEqual(stack);
    while (game.clearing.length > 0) game = step(game, autoplayer);
    expect(game.board.every((v) => v === 0)).toBe(true);
  });
});
