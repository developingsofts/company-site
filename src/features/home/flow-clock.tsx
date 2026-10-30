"use client";

import { type MotionValue, useAnimationFrame, useInView, useMotionValue, useReducedMotion } from "motion/react";
import { type ReactNode, createContext, useContext, useRef } from "react";

const FlowClockContext = createContext<MotionValue<number> | null>(null);

// A frame after a stall (a background tab, a debugger) counts as one frame,
// so nothing leaps across the screen when the page comes back.
const longestStep = 0.1;

/**
 * Seconds of flow for everything inside to move by. It runs only while the
 * block is on screen and stands still under reduced motion, so whatever reads
 * it holds its opening frame instead.
 */
export function FlowClock({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const time = useMotionValue(0);
  const visible = useInView(ref);
  const reduce = useReducedMotion();

  useAnimationFrame((_, delta) => {
    if (visible && !reduce) time.set(time.get() + Math.min(delta / 1000, longestStep));
  });

  return (
    <FlowClockContext value={time}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </FlowClockContext>
  );
}

export function useFlowTime(): MotionValue<number> {
  const time = useContext(FlowClockContext);
  if (!time) throw new Error("useFlowTime needs a <FlowClock> around it");
  return time;
}
