import { type Bag, createBag, draw } from "./random-bag";
import { random } from "./seeded-random";
import { type Kind, rotations } from "./tetrominoes";

export interface Piece {
  kind: Kind;
  rotation: number;
  x: number;
  y: number;
  /** Ticks since it spawned. */
  age: number;
  /** What the player did on the last steering beat; absent if nothing. */
  lastMove?: Move;
}

export type Move = "left" | "right" | "turn";

/** Where the player is steering the falling piece. */
export interface Plan {
  rotation: number;
  x: number;
  /** Ticks the piece drifts straight down before the player starts steering. */
  wait: number;
}

export interface Game {
  cols: number;
  rows: number;
  /** Row-major, 1 where a block has locked. Replaced, never mutated. */
  board: Uint8Array;
  piece: Piece | null;
  plan: Plan | null;
  /** Full rows dissolving before they are removed. */
  clearing: readonly number[];
  /** Column the dissolve spreads out from: the middle of the piece that completed the rows. */
  clearFrom: number;
  /** Ticks left before the dissolving rows are removed. */
  clearTicks: number;
  tick: number;
  /** Pieces locked since the game began. */
  placed: number;
  /** Pieces locked since a row was last completed. */
  sinceClear: number;
  bag: Bag;
  /** Seed for the player's dice, separate from the pieces' bag. */
  luck: number;
}

export type Board = Pick<Game, "cols" | "rows" | "board">;

/**
 * Chooses where to steer a freshly spawned piece. `roll` returns a fresh
 * number in [0, 1) each call, drawn from the game's luck, so a game replays
 * the same from the same seed.
 */
export type Player = (game: Game & { piece: Piece }, roll: () => number) => Plan;

/** Ticks a completed row is held while it dissolves. */
export const dissolveTicks = 6;

/**
 * A piece falls one row every this many ticks, whatever else it is doing, so
 * it drops at one steady speed and can be drawn gliding between rows.
 */
export const gravityEvery = 5;

/**
 * The player turns or shifts the piece at most once every this many ticks,
 * counted from when it spawned: an unhurried hand, and a steady rhythm whose
 * every beat can be drawn as one glide from start to finish.
 */
export const steerEvery = 3;

export function newGame(cols: number, rows: number, seed: number): Game {
  return {
    cols,
    rows,
    board: new Uint8Array(cols * rows),
    piece: null,
    plan: null,
    clearing: [],
    clearFrom: 0,
    clearTicks: 0,
    tick: 0,
    placed: 0,
    sinceClear: 0,
    bag: createBag(seed),
    luck: seed ^ 0x5bd1e995,
  };
}

export function cellsOf(piece: Piece) {
  return rotations[piece.kind][piece.rotation].map(([x, y]) => [piece.x + x, piece.y + y] as const);
}

export function collides({ cols, rows, board }: Board, piece: Piece): boolean {
  return cellsOf(piece).some(
    ([x, y]) => x < 0 || x >= cols || y >= rows || (y >= 0 && board[y * cols + x] === 1),
  );
}

/**
 * Rows a new piece starts above the board, out of sight. The player steers at
 * an unhurried pace, so the lead buys it the beats to line up anywhere on a
 * wide board before the piece comes into view.
 */
export const spawnLead = 3;

/** A new piece, above the board at the column `at` (0–1) of the way across. */
export function spawn(cols: number, kind: Kind, at: number): Piece {
  const cells = rotations[kind][0];
  const width = Math.max(...cells.map(([x]) => x)) + 1;
  const bottom = Math.max(...cells.map(([, y]) => y));
  return { kind, rotation: 0, x: Math.floor(at * (cols - width + 1)), y: -bottom - 1 - spawnLead, age: 0 };
}

/**
 * One tick of steering and gravity. Returns the moved piece, or `landed` when
 * it can fall no further. A plan that runs into the stack is given up where
 * the piece stands.
 */
export function advance(
  board: Board,
  piece: Piece,
  plan: Plan,
  tick: number,
): { piece: Piece; plan: Plan; landed: boolean } {
  let next: Piece = { ...piece, age: piece.age + 1 };
  if (next.age % steerEvery === 0) {
    next.lastMove = undefined;
    const wants = piece.rotation !== plan.rotation || piece.x !== plan.x;
    if (wants && next.age > plan.wait) {
      const turn = next.rotation !== plan.rotation;
      const step = Math.sign(plan.x - next.x);
      const moved: Piece = turn
        ? { ...next, rotation: (next.rotation + 1) % 4, lastMove: "turn" }
        : { ...next, x: next.x + step, lastMove: step < 0 ? "left" : "right" };
      if (collides(board, moved)) plan = { rotation: next.rotation, x: next.x, wait: plan.wait };
      else next = moved;
    }
  }
  if (tick % gravityEvery !== 0) return { piece: next, plan, landed: false };
  const fallen = { ...next, y: next.y + 1 };
  if (collides(board, fallen)) return { piece: next, plan, landed: true };
  return { piece: fallen, plan, landed: false };
}

/** The board with the piece locked in, or null if it sticks out the top. */
export function lock({ cols, board }: Board, piece: Piece): Uint8Array | null {
  const out = board.slice();
  for (const [x, y] of cellsOf(piece)) {
    if (y < 0) return null;
    out[y * cols + x] = 1;
  }
  return out;
}

export function fullRows({ cols, rows, board }: Board): number[] {
  const out: number[] = [];
  for (let y = 0; y < rows; y++) {
    if (board.subarray(y * cols, (y + 1) * cols).every((v) => v === 1)) out.push(y);
  }
  return out;
}

export function removeRows({ cols, board }: Board, remove: readonly number[]): Uint8Array {
  const out = new Uint8Array(board.length);
  let to = board.length / cols - 1;
  for (let y = to; y >= 0; y--) {
    if (remove.includes(y)) continue;
    out.set(board.subarray(y * cols, (y + 1) * cols), to * cols);
    to--;
  }
  return out;
}

export function step(game: Game, player: Player): Game {
  const tick = game.tick + 1;

  if (game.clearing.length > 0) {
    if (game.clearTicks > 1) return { ...game, tick, clearTicks: game.clearTicks - 1 };
    return { ...game, tick, board: removeRows(game, game.clearing), clearing: [], clearTicks: 0 };
  }

  if (!game.piece || !game.plan) {
    const [kind, bag] = draw(game.bag);
    let luck = game.luck;
    const roll = () => {
      const [value, seed] = random(luck);
      luck = seed;
      return value;
    };
    // Pieces come in anywhere along the top, so they don't all slide out
    // from the middle.
    const next = { ...game, tick, bag, piece: spawn(game.cols, kind, roll()) };
    const plan = player(next, roll);
    return { ...next, plan, luck };
  }

  const moved = advance(game, game.piece, game.plan, tick);
  if (!moved.landed) return { ...game, tick, piece: moved.piece, plan: moved.plan };

  const locked = lock(game, moved.piece);
  const placed = game.placed + 1;
  const cells = cellsOf(moved.piece);
  const clearFrom = Math.round(cells.reduce((sum, [x]) => sum + x, 0) / cells.length);
  // Topped out: the whole stack dissolves and the game starts over on the
  // empty board.
  const clearing = locked
    ? fullRows({ ...game, board: locked })
    : Array.from({ length: game.rows }, (_, y) => y).filter((y) =>
        game.board.subarray(y * game.cols, (y + 1) * game.cols).includes(1),
      );
  return {
    ...game,
    tick,
    placed,
    sinceClear: locked && clearing.length === 0 ? game.sinceClear + 1 : 0,
    board: locked ?? game.board,
    piece: null,
    plan: null,
    clearing,
    clearFrom,
    clearTicks: clearing.length > 0 ? dissolveTicks : 0,
  };
}

/** Plays on until `pieces` have locked and nothing is falling or clearing. */
export function playUntil(game: Game, pieces: number, player: Player): Game {
  while (game.placed < pieces || game.piece || game.clearing.length > 0) game = step(game, player);
  return game;
}
