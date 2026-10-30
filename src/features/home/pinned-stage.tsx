"use client";

import {
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { type ReactNode, createContext, useContext, useEffect, useRef } from "react";
import { arrivalOf } from "@/features/site";
import { spring } from "@/lib/springs";
import { followSpring } from "./follow-spring";

interface StageProgress {
  /** Stage widths scrolled past the stage's arrival, straight from the scroll. */
  raw: MotionValue<number>;
  /** The same, eased by a spring so what it drives glides after the scroll; raw under reduced motion. */
  progress: MotionValue<number>;
}

const StageContext = createContext<StageProgress | null>(null);

/**
 * A panel in a sideways chapter that, once it has slid all the way in, holds
 * still for `dwell` screen widths of scrolling, so what plays out inside it
 * can follow the scroll before the chapter moves on. It does so by being that
 * much wider than the screen and shifting its content back as the track
 * moves past. Children span the chapter's band and body rows as a subgrid.
 */
export function PinnedStage({ dwell, children }: { dwell: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  // Unknown until measured in the browser: until then the stage counts as
  // not yet arrived, on the server as much as on the client.
  const arrival = useMotionValue(Number.POSITIVE_INFINITY);
  const width = useMotionValue(1);
  const past = useTransform(() => scrollY.get() - arrival.get());
  // Whole pixels, like the chapter's own shift, so the two cancel exactly.
  const x = useTransform(() => Math.round(Math.min(Math.max(past.get(), 0), dwell * width.get())));
  // Clamped near the stage so the spring never chases an unmeasured infinity.
  const raw = useTransform(() => Math.min(Math.max(past.get() / width.get(), -2), dwell + 1));
  const eased = useSpring(raw, followSpring(spring.slow));

  useEffect(() => {
    const el = ref.current;
    const stage = stageRef.current;
    if (!el || !stage) return;
    const measure = () => {
      width.set(Math.max(1, stage.offsetWidth));
      arrival.set(arrivalOf(el));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, [arrival, width]);

  return (
    <div
      ref={ref}
      className="row-span-2 grid grid-rows-subgrid"
      style={{ width: `calc(100cqw * ${1 + dwell})` }}
    >
      <motion.div ref={stageRef} className="row-span-2 grid w-[100cqw] grid-rows-subgrid" style={{ x }}>
        <StageContext value={{ raw, progress: reduce ? raw : eased }}>{children}</StageContext>
      </motion.div>
    </div>
  );
}

export function useStageProgress(): StageProgress {
  const stage = useContext(StageContext);
  if (!stage) throw new Error("useStageProgress needs a <PinnedStage> around it");
  return stage;
}
