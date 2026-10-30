export interface BoardSize {
  cols: number;
  rows: number;
  /** Rows that fit the box, fractional: the top row may be cut off. */
  visibleRows: number;
}

// Blocks aim for a twentieth of the width, held between these sizes in px, so
// a phone gets about ten columns and a desktop a little over twenty.
const minCell = 40;
const maxCell = 64;

/** A board of square cells spanning the box's width exactly, sized from its bottom edge up. */
export function boardSize(width: number, height: number): BoardSize | null {
  if (width <= 0 || height <= 0) return null;
  const cols = Math.max(4, Math.round(width / Math.min(maxCell, Math.max(minCell, width / 20))));
  const visibleRows = height / (width / cols);
  // A piece needs four rows to turn in.
  if (visibleRows < 4) return null;
  return { cols, rows: Math.ceil(visibleRows), visibleRows };
}
