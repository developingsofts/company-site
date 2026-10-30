"use client";

import { useInView } from "motion/react";
import { type ReactNode, createContext, useContext, useRef } from "react";

// Outside an <Arrival>, everything counts as arrived and shows at once.
const ArrivalContext = createContext(true);

/**
 * Marks a page as arrived once half of it is on screen, for good: whatever
 * inside waits for it (text reveals, the swarm) starts then and not on load,
 * when the page may still be off to the side.
 */
export function Arrival({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const arrived = useInView(ref, { once: true, amount: 0.5 });
  return (
    <ArrivalContext value={arrived}>
      <div ref={ref} data-arrived={arrived} className={className}>
        {children}
      </div>
    </ArrivalContext>
  );
}

export function useArrived(): boolean {
  return useContext(ArrivalContext);
}
