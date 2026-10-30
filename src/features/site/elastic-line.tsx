"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { pluck } from "./pluck";

// A plucked string has to ring: underdamped well past any UI spring tier, which
// all settle without visible oscillation.
const ring = { type: "spring", stiffness: 300, damping: 5 } as const;

/** Px from the line within which the pointer catches it. */
const grabPx = 5;
/** Px from the line past which it slips free; capped by the strip's half-height. */
const releasePx = 100;

/**
 * A horizontal line through the middle of its box that the pointer can catch
 * and pull; let go, it springs back and wobbles. Under reduced motion it stays
 * a straight line.
 */
export function ElasticLine({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const reduce = useReducedMotion();
  const width = useMotionValue(0);
  const height = useMotionValue(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const d = useTransform(() => {
    const mid = height.get() / 2;
    return `M0 ${mid}Q${x.get()} ${y.get()} ${width.get()} ${mid}`;
  });

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    let grabbed = false;

    const letGo = () => {
      grabbed = false;
      animate(x, width.get() / 2, ring);
      animate(y, height.get() / 2, ring);
    };
    const observer = new ResizeObserver(([entry]) => {
      width.set(entry.contentRect.width);
      height.set(entry.contentRect.height);
      if (!grabbed) {
        x.jump(entry.contentRect.width / 2);
        y.jump(entry.contentRect.height / 2);
      }
    });
    observer.observe(svg);
    if (reduce) return () => observer.disconnect();

    const onMove = (event: PointerEvent) => {
      const box = svg.getBoundingClientRect();
      const next = pluck(
        event.clientX - box.left,
        event.clientY - box.top,
        box.width,
        box.height,
        grabbed,
        grabPx,
        releasePx,
      );
      if (next.grabbed) {
        grabbed = true;
        x.jump(next.control.x);
        y.jump(next.control.y);
      } else if (grabbed) {
        letGo();
      }
    };
    const onLeave = () => {
      if (grabbed) letGo();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce, width, height, x, y]);

  return (
    <svg ref={ref} aria-hidden data-elastic-line className={cn("pointer-events-none overflow-visible", className)}>
      <motion.path d={d} fill="none" stroke="currentColor" strokeWidth={1} />
    </svg>
  );
}
