"use client";

import { useRef } from "react";
import Noise from "@/components/Noise";
import { cn } from "@/lib/utils";
import { TetrisField } from "./tetris-field";
import { useBoardSize } from "./use-board-size";

/**
 * A self-playing game of Tetris that fills its box, over a film-grain ground.
 * The board is sized in the browser, so the server renders the empty box.
 */
export function TetrisBoard({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const size = useBoardSize(ref);
  return (
    <div ref={ref} className={cn("relative overflow-clip bg-background text-primary", className)}>
      {/* Under the blocks: the grain textures the ground, the blocks stay
          flat. The ground is painted here, not inherited, because the grain
          blends with what sits beneath it inside the moving track's own
          stacking context, where the page colour isn't. */}
      <Noise opacity={0.25} fps={12} contrast={0.5} blendMode="overlay" />
      {size && <TetrisField key={`${size.cols}x${size.rows}`} {...size} />}
    </div>
  );
}
