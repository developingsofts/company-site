"use client";

import { useMotionValueEvent } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useFlowTime } from "./flow-clock";

/** Seconds a packet takes to run the length of a line. */
const crossing = 2.4;

/** How far along the line packet `index` of `count` is at `time`, from 0 to 1. */
function along(index: number, count: number, offset: number, time: number): number {
  const run = index / count + offset + time / crossing;
  return run - Math.floor(run);
}

interface FlowLineProps {
  /** `x` runs left to right, `y` top to bottom. */
  axis: "x" | "y";
  packets: number;
  /** Where in its run the line starts, 0 to 1, so neighbouring lines don't move in step. */
  offset?: number;
  className?: string;
}

/** A dotted line with small square packets running along it. */
export function FlowLine({ axis, packets, offset = 0, className }: FlowLineProps) {
  const time = useFlowTime();
  const refs = useRef<(HTMLSpanElement | null)[]>([]);

  // Packets fade at either end, so wrapping round reads as a new one arriving.
  const place = (index: number, now: number) => {
    const at = along(index, packets, offset, now);
    return {
      transform: axis === "x" ? `translate(${at * 100}cqw, -50%)` : `translate(-50%, ${at * 100}cqh)`,
      opacity: Math.min(1, at / 0.1, (1 - at) / 0.1),
    };
  };

  useMotionValueEvent(time, "change", (now) => {
    refs.current.forEach((el, i) => {
      if (!el) return;
      const { transform, opacity } = place(i, now);
      el.style.transform = transform;
      el.style.opacity = String(opacity);
    });
  });

  const now = time.get();
  return (
    <div
      aria-hidden
      data-flow-line={axis}
      className={cn(
        "relative border-dotted border-primary",
        axis === "x" ? "[container-type:inline-size] border-t" : "[container-type:size] border-l",
        className,
      )}
    >
      {Array.from({ length: packets }, (_, i) => (
        <span
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className={cn(
            "absolute size-[5px] bg-primary will-change-transform",
            axis === "x" ? "top-[-0.5px] left-0 -ml-[2.5px]" : "top-0 left-[-0.5px] -mt-[2.5px]",
          )}
          style={place(i, now)}
        />
      ))}
    </div>
  );
}
