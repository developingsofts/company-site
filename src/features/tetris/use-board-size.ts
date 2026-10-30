"use client";

import { type RefObject, useEffect, useState } from "react";
import { type BoardSize, boardSize } from "./board-size";

/** The board that fits `target`, kept current as it resizes. */
export function useBoardSize(target: RefObject<Element | null>): BoardSize | null {
  const [size, setSize] = useState<BoardSize | null>(null);

  useEffect(() => {
    const el = target.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const next = boardSize(entry.contentRect.width, entry.contentRect.height);
      // A new object every callback would restart the game on every resize
      // tick; only a change in cells counts.
      setSize((prev) =>
        prev && next && prev.cols === next.cols && prev.rows === next.rows && prev.visibleRows === next.visibleRows
          ? prev
          : next,
      );
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return size;
}
