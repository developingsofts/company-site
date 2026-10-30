import { type Board, type Game, type Piece, type Plan, advance, fullRows, lock } from "./game";

// Weights from Yiyuan Lee's genetic search for a line-clearing Tetris player:
// they trade stack height, cleared lines, buried holes and an uneven surface.
const weights = { height: -0.510066, lines: 0.760666, holes: -0.35663, bumpiness: -0.184483 };

// The player improvises: it picks at random among the placements scoring
// within this much of the best one, so no two games look alike.
const slack = 1;
// It loses patience as pieces lock without completing a row: its leeway
// shrinks to nothing by this many, and from then on it plays its best until
// a row completes. That keeps rows coming however the dice fall.
const patience = 8;
// Past this share of the board's height it plays its best regardless.
const danger = 0.4;
// The most ticks a piece drifts straight down before it starts steering.
const maxWait = 6;

function heights({ cols, rows, board }: Board): number[] {
  const out: number[] = [];
  for (let x = 0; x < cols; x++) {
    let y = 0;
    while (y < rows && board[y * cols + x] === 0) y++;
    out.push(rows - y);
  }
  return out;
}

function score(board: Board): number {
  const { cols, rows } = board;
  const columns = heights(board);
  let holes = 0;
  for (let x = 0; x < cols; x++) {
    for (let y = rows - columns[x] + 1; y < rows; y++) if (board.board[y * cols + x] === 0) holes++;
  }
  let bumpiness = 0;
  for (let x = 1; x < cols; x++) bumpiness += Math.abs(columns[x] - columns[x - 1]);
  return (
    weights.height * columns.reduce((a, b) => a + b, 0) +
    weights.lines * fullRows(board).length +
    weights.holes * holes +
    weights.bumpiness * bumpiness
  );
}

/** Plays the piece out under `plan`; null if the plan can't be reached. */
function land(game: Game, plan: Plan): Uint8Array | null {
  let piece: Piece = game.piece!;
  let tick = game.tick;
  for (;;) {
    tick++;
    const moved = advance(game, piece, plan, tick);
    if (moved.plan !== plan) return null;
    piece = moved.piece;
    if (moved.landed) {
      if (piece.rotation !== plan.rotation || piece.x !== plan.x) return null;
      return lock(game, piece);
    }
  }
}

/**
 * Tries every rotation and column, picks one of the good landings at random,
 * and lets the piece drift a random while before steering for it. Out of
 * patience, it takes any landing that completes a row.
 */
export function autoplayer(game: Game & { piece: Piece }, roll: () => number): Plan {
  const options: { rotation: number; x: number; score: number; lines: number }[] = [];
  for (let rotation = 0; rotation < 4; rotation++) {
    for (let x = -3; x < game.cols; x++) {
      const board = land(game, { rotation, x, wait: 0 });
      if (!board) continue;
      const after = { ...game, board };
      options.push({ rotation, x, score: score(after), lines: fullRows(after).length });
    }
  }
  if (options.length === 0) return { rotation: game.piece.rotation, x: game.piece.x, wait: 0 };

  const impatient = game.sinceClear >= patience;
  const finishing = impatient ? options.filter((o) => o.lines > 0) : [];
  const candidates = finishing.length > 0 ? finishing : options;
  const best = Math.max(...candidates.map((o) => o.score));
  const tall = Math.max(...heights(game)) > game.rows * danger;
  const leeway = tall ? 0 : slack * Math.max(0, 1 - game.sinceClear / patience);
  const pool = candidates.filter((o) => o.score >= best - leeway);
  const { rotation, x } = pool[Math.floor(roll() * pool.length)];

  // The longest drift up to the one rolled that still reaches the spot.
  for (let wait = Math.floor(roll() * (maxWait + 1)); wait > 0; wait--) {
    const plan = { rotation, x, wait };
    if (land(game, plan)) return plan;
  }
  return { rotation, x, wait: 0 };
}
