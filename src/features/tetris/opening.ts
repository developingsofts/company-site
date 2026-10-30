import { autoplayer } from "./autoplayer";
import { type Game, newGame, playUntil } from "./game";

// About one piece per thirty cells: a row or so of rubble to build on.
const piecesPerCell = 0.03;
/** The tallest the opening stack may stand, in rows. */
export const openingRows = 3;
const tries = 24;

function stackRows({ cols, rows, board }: Game): number {
  const top = board.indexOf(1);
  return top < 0 ? 0 : rows - Math.floor(top / cols);
}

/**
 * A game a few pieces in, on a low stack. Improvised play sometimes piles a
 * few pieces into a tower, so it deals again from the next seed until the
 * stack stays within `openingRows`.
 */
export function opening(cols: number, rows: number, seed: number): Game {
  const pieces = Math.round(cols * rows * piecesPerCell);
  let game = playUntil(newGame(cols, rows, seed), pieces, autoplayer);
  for (let i = 1; i < tries && stackRows(game) > openingRows; i++) {
    game = playUntil(newGame(cols, rows, seed + i), pieces, autoplayer);
  }
  return game;
}
