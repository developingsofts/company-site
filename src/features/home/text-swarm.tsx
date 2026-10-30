"use client";

import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import SwarmCursor from "@/components/SwarmCursor";
import { useArrived } from "./arrival";

// The canvas parses colours itself and can't read CSS variables, so this
// repeats --primary.
const accent = "oklch(0.45 0.15 22)";

/**
 * A small red swarm that follows the pointer behind `children` and fades out
 * when the pointer leaves. It wakes when its page arrives, not while the page
 * is still sliding in, and stays off under reduced motion, where it would
 * otherwise sit still in the middle of the text.
 */
export function TextSwarm({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const arrived = useArrived();
  return (
    <SwarmCursor
      className={className}
      enabled={arrived && !reduce}
      lightMode
      color={accent}
      count={260}
      size={2}
      spread={40}
      swirl={0.5}
      tail={0.4}
      idle="hide"
      // The intro fades the swarm up from nothing. Without it the swarm starts
      // fully shown, bunched in the panel's top-left corner, and since it
      // doesn't run off screen it would still be there, mid-fade, as the
      // panel slid in.
      intro
      targets=""
    >
      {children}
    </SwarmCursor>
  );
}
