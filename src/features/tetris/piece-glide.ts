import { type Game, type Move, type Piece, type Plan, advance, gravityEvery, steerEvery } from "./game";

/** How far to draw the falling piece past where the rules have it. */
export interface Glide {
  /** Columns sideways, toward its next shift. */
  x: number;
  /** Rows down, toward its next fall. */
  y: number;
  /** Quarter turns clockwise, toward its next turn. */
  turn: number;
}

/**
 * A cubic from 0 to 1 over `t` in [0, 1] that leaves at speed `from` and
 * arrives at speed `to`, in moves per beat. A beat that carries on a run of
 * the same move enters and leaves at the run's steady speed of 1, so the run
 * glides through without a pause; only its first beat eases in from rest and
 * its last eases out to rest.
 */
function hermite(t: number, from: number, to: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return -2 * t3 + 3 * t2 + from * (t3 - 2 * t2 + t) + to * (t3 - t2);
}

/**
 * The piece `ticks` on, as the rules will have it, and whether it landed
 * before then. It locks where it lands, so a move made on the landing tick
 * still happens.
 */
function ahead(game: Game, piece: Piece, plan: Plan, ticks: number): { piece: Piece; landed: boolean } {
  let next = piece;
  let course = plan;
  for (let i = 1; i <= ticks; i++) {
    const moved = advance(game, next, course, game.tick + i);
    next = moved.piece;
    course = moved.plan;
    if (moved.landed) return { piece: next, landed: i < ticks };
  }
  return { piece: next, landed: false };
}

/**
 * Where to draw the falling piece `progress` (0–1) of the way through the
 * current tick. The rules move it a whole cell or a quarter turn at a time;
 * drawn at this offset it falls at one steady speed, and each shift or turn
 * plays out across the whole beat that leads up to it, arriving exactly as
 * the rules make the move. The rules are played ahead to learn what the next
 * fall and the next two moves will be, so nothing is begun that won't
 * happen, a shift off a ledge included, and a run of moves flows as one.
 */
export function pieceGlide(game: Game, piece: Piece, plan: Plan, progress: number): Glide {
  // The next fall comes on the next multiple of `gravityEvery`; the last one
  // was `tick % gravityEvery` ticks ago.
  const sinceFall = game.tick % gravityEvery;
  const falls = ahead(game, piece, plan, gravityEvery - sinceFall).piece.y > piece.y;
  const y = falls ? (sinceFall + progress) / gravityEvery : 0;

  // The next move comes on the next multiple of `steerEvery` in its life.
  const sinceMove = piece.age % steerEvery;
  const toBeat = steerEvery - sinceMove;
  const now = ahead(game, piece, plan, toBeat);
  const move: Move | undefined = now.landed ? undefined : now.piece.lastMove;
  if (!move) return { x: 0, y, turn: 0 };

  const after = ahead(game, piece, plan, toBeat + steerEvery);
  const carriedIn = piece.lastMove === move;
  const carriedOut = !after.landed && after.piece.lastMove === move;
  const beat = hermite((sinceMove + progress) / steerEvery, carriedIn ? 1 : 0, carriedOut ? 1 : 0);
  return {
    x: move === "turn" ? 0 : (move === "left" ? -1 : 1) * beat,
    y,
    turn: move === "turn" ? beat : 0,
  };
}
