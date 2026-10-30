import { describe, expect, it } from "vitest";
import {
  type Game,
  type Piece,
  type Plan,
  autoplayer,
  gravityEvery,
  newGame,
  pieceGlide,
  step,
  steerEvery,
} from "@/features/tetris";

const cols = 10;
const rows = 12;
const at = (piece: Piece, plan: Plan, tick = 1): Game => ({ ...newGame(cols, rows, 1), tick, piece, plan });

/** Where the piece is drawn: column, row and quarter turns. */
interface Drawn {
  x: number;
  y: number;
  turn: number;
}

function drawn(game: Game, progress: number): Drawn {
  const glide = pieceGlide(game, game.piece!, game.plan!, progress);
  return { x: game.piece!.x + glide.x, y: game.piece!.y + glide.y, turn: game.piece!.rotation + glide.turn };
}

describe("pieceGlide", () => {
  it("falls at one steady speed, a row per gravity period", () => {
    const piece: Piece = { kind: "O", rotation: 0, x: 4, y: 2, age: 0 };
    const plan = { rotation: 0, x: 4, wait: 0 };
    const ys: number[] = [];
    for (let tick = 0; tick < gravityEvery; tick++) {
      for (const p of [0, 0.5, 1]) ys.push(pieceGlide(at(piece, plan, tick), piece, plan, p).y);
    }
    const steps = ys.map((y, i) => (i === 0 ? 0 : y - ys[i - 1])).filter((d) => d !== 0);
    for (const d of steps) expect(d).toBeCloseTo(1 / (2 * gravityEvery));
    expect(ys.at(-1)).toBeCloseTo(1);
  });

  it("spreads a shift across its whole beat", () => {
    const piece: Piece = { kind: "O", rotation: 0, x: 4, y: 2, age: 0 };
    const plan = { rotation: 0, x: 7, wait: 0 };
    const xs = [0, 1, 2].flatMap((age) =>
      [0.25, 0.5, 0.75].map((p) => pieceGlide(at({ ...piece, age }, plan), { ...piece, age }, plan, p).x),
    );
    for (let i = 1; i < xs.length; i++) expect(xs[i]).toBeGreaterThan(xs[i - 1]);
    expect(xs[0]).toBeGreaterThan(0);
    expect(xs.at(-1)).toBeLessThan(1);
  });

  it("turns a quarter across its beat, toward the next rotation state", () => {
    const piece: Piece = { kind: "T", rotation: 0, x: 4, y: 2, age: 1 };
    const glide = pieceGlide(at(piece, { rotation: 1, x: 4, wait: 0 }), piece, { rotation: 1, x: 4, wait: 0 }, 0.5);
    expect(glide.turn).toBeCloseTo(0.5);
    expect(glide.x).toBe(0);
  });

  it("begins no move while the piece drifts, nor one the stack would block", () => {
    const piece: Piece = { kind: "O", rotation: 0, x: 4, y: 2, age: 0 };
    expect(pieceGlide(at(piece, { rotation: 0, x: 7, wait: 6 }), piece, { rotation: 0, x: 7, wait: 6 }, 0.5).x).toBe(0);
    const walled = { ...at(piece, { rotation: 0, x: 7, wait: 0 }), board: new Uint8Array(cols * rows) };
    for (let y = 0; y < rows; y++) walled.board[y * cols + 6] = 1;
    expect(pieceGlide(walled, piece, walled.plan!, 0.5).x).toBe(0);
  });

  it("slides a run of shifts at one steady speed, easing only at its two ends", () => {
    const plan: Plan = { rotation: 0, x: 8, wait: 0 };
    let game: Game = { ...newGame(cols, 40, 1), piece: { kind: "O", rotation: 0, x: 1, y: 0, age: 0 }, plan };
    const xs: number[] = [];
    while (game.piece!.x < plan.x) {
      for (const p of [0, 0.5]) xs.push(drawn(game, p).x);
      game = step(game, () => plan);
    }
    const speeds = xs.slice(1).map((x, i) => x - xs[i]);
    // Seven shifts: the first and last beats ease, the five between hold the
    // run's speed, a cell a beat, with never a pause at a cell.
    const steady = 1 / (2 * steerEvery);
    const between = speeds.slice(2 * steerEvery, -2 * steerEvery);
    expect(between.length).toBeGreaterThanOrEqual(5 * 2 * steerEvery - 1);
    for (const v of between) expect(v).toBeCloseTo(steady);
    for (const v of speeds.slice(1)) expect(v).toBeGreaterThan(0);
  });

  // Across a whole game, ticks included: drawn frame to frame, the piece never
  // jumps, and each tick picks up exactly where the last one's drawing ended.
  it("never jumps or lurches, through a whole stretch of improvised play", () => {
    let game: Game = newGame(cols, rows, 42);
    let checked = 0;
    let trail: Drawn[] = [];
    for (let i = 0; i < 2000; i++) {
      const next = step(game, autoplayer);
      if (game.piece && next.piece && next.placed === game.placed && next.piece.age > game.piece.age) {
        for (const p of [0, 0.25, 0.5, 0.75]) trail.push(drawn(game, p));
        const last = drawn(game, 1);
        const after = drawn(next, 0);
        expect(after.x).toBeCloseTo(last.x);
        expect(after.y).toBeCloseTo(last.y);
        expect(after.turn % 4).toBeCloseTo(last.turn % 4);
        checked++;
      } else {
        trail = [];
      }
      // Speed changes gradually, across tick boundaries too: sideways and
      // turning, the piece never stops or starts dead between cells.
      for (let k = Math.max(2, trail.length - 4); k < trail.length; k++) {
        const [a, b, c] = [trail[k - 2], trail[k - 1], trail[k]];
        expect(Math.abs(c.x - 2 * b.x + a.x)).toBeLessThan(0.06);
        expect(Math.abs(c.turn - 2 * b.turn + a.turn)).toBeLessThan(0.06);
        expect(Math.abs(c.x - b.x)).toBeLessThan(0.2);
        expect(Math.abs(c.y - b.y)).toBeLessThan(0.2);
      }
      game = next;
    }
    expect(checked).toBeGreaterThan(1000);
  });
});
