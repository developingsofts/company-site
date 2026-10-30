"use client";

import { motion, useAnimationFrame } from "motion/react";
import { useRef } from "react";
import { spring } from "@/lib/springs";
import type { BoardSize } from "./board-size";
import { type Piece, dissolveTicks } from "./game";
import { opening } from "./opening";
import { type Glide, pieceGlide } from "./piece-glide";
import { boxSize, rotations } from "./tetrominoes";
import { tickMs, useAutoplay } from "./use-autoplay";

// Half the gap between neighbouring blocks, in cells.
const inset = 0.025;

const centered = { transformBox: "fill-box", transformOrigin: "center" } as const;

const still: Glide = { x: 0, y: 0, turn: 0 };

/**
 * The falling piece's place on the board: drawn in its first rotation state
 * and turned about its box's centre, so a turn can be drawn part-way.
 */
function placement(piece: Piece, glide: Glide): string {
  const half = boxSize[piece.kind] / 2;
  const angle = 90 * (piece.rotation + glide.turn);
  return `translate(${piece.x} ${piece.y}) rotate(${angle} ${half} ${half})`;
}

interface TetrisFieldProps extends BoardSize {
  /** Replays one exact game; left out, every load deals a new one. */
  seed?: number;
}

/**
 * Plays one game on a board of a fixed size; remount it to change the size.
 * It only ever renders in the browser (the board is measured first), so a
 * random game can't disagree with a server render.
 */
export function TetrisField({ cols, rows, visibleRows, seed }: TetrisFieldProps) {
  const ref = useRef<SVGSVGElement>(null);
  const fallingRef = useRef<SVGGElement>(null);
  const placedRef = useRef<SVGGElement>(null);
  const { game, clock } = useAutoplay(ref, () => opening(cols, rows, seed ?? Math.floor(Math.random() * 2 ** 31)));

  // Every frame, the falling piece is drawn part of the way to its next cell
  // and its next quarter turn, so it falls, slides and turns smoothly instead
  // of jumping once per tick.
  useAnimationFrame(() => {
    const falling = fallingRef.current;
    const placed = placedRef.current;
    const current = clock.current;
    const { piece, plan } = current?.game ?? {};
    if (!falling || !placed || !current || !piece || !plan) return;
    // Motion's frame time counts from when this loop began, not from page load
    // like the clock's, so read the same clock here.
    const progress = Math.min(1, Math.max(0, (performance.now() - current.tickStart) / tickMs));
    const glide = pieceGlide(current.game, piece, plan, progress);
    falling.setAttribute("transform", `translate(${glide.x} ${glide.y})`);
    placed.setAttribute("transform", placement(piece, glide));
  });

  const settled: [number, number][] = [];
  const dissolving: [number, number][] = [];
  for (let y = 0; y < rows; y++) {
    const into = game.clearing.includes(y) ? dissolving : settled;
    for (let x = 0; x < cols; x++) if (game.board[y * cols + x] === 1) into.push([x, y]);
  }

  // The dissolve spreads out from the piece that set it off and has to finish
  // inside the ticks the rows are held for, however far it has to reach.
  const fade = spring.slow.exit;
  const reach = Math.max(1, game.clearFrom, cols - 1 - game.clearFrom);
  const stagger = ((dissolveTicks * tickMs) / 1000 - fade.duration) / reach;

  return (
    <svg
      ref={ref}
      aria-hidden
      data-tetris
      data-placed={game.placed}
      // Anchored at the bottom: only the top row may be cut off, and pieces
      // fall in from above the box.
      viewBox={`0 ${rows - visibleRows} ${cols} ${visibleRows}`}
      className="absolute inset-0 size-full"
      fill="currentColor"
      shapeRendering="crispEdges"
    >
      {settled.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x + inset} y={y + inset} width={1 - inset * 2} height={1 - inset * 2} />
      ))}
      {/* Smooth edges while it moves: snapped to whole pixels, a gliding
          block would flicker a pixel wider and narrower. The outer group
          carries the glide, the inner one the piece's place and turn; the
          frame loop rewrites both every frame. */}
      <g ref={fallingRef} data-falling shapeRendering="geometricPrecision">
        {game.piece && (
          <g ref={placedRef} data-falling-piece transform={placement(game.piece, still)}>
            {rotations[game.piece.kind][0].map(([x, y]) => (
              <rect key={`${x}-${y}`} x={x + inset} y={y + inset} width={1 - inset * 2} height={1 - inset * 2} />
            ))}
          </g>
        )}
      </g>
      {dissolving.map(([x, y]) => (
        <motion.rect
          key={`dissolve-${x}-${y}`}
          data-dissolving
          x={x + inset}
          y={y + inset}
          width={1 - inset * 2}
          height={1 - inset * 2}
          style={centered}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 0.2 }}
          transition={{ ...fade, delay: Math.abs(x - game.clearFrom) * stagger }}
        />
      ))}
    </svg>
  );
}
