"use client";

import { useMotionValueEvent } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { typeClass } from "@/lib/type-scale";
import { curvePath, fanCurves, pointOn, tokenAt, tokenDigit, tokenOpacity } from "./fan-geometry";
import { useFlowTime } from "./flow-clock";

const curves = fanCurves(23);
const tokenCount = { in: 40, out: 44 };

/**
 * One end of the process diagram. `in` gathers a stream of raw hex digits
 * from the left edge into a point; `out` sends finished squares from a point
 * out to the right edge. The box sizes the fan, so the tokens are placed in
 * container units and moved by transform alone.
 */
export function DataFan({ flow, className }: { flow: "in" | "out"; className?: string }) {
  const time = useFlowTime();
  const tokens = useRef<(HTMLSpanElement | null)[]>([]);

  const place = (index: number, now: number) => {
    const { curve, t, lap } = tokenAt(index, now, curves.length);
    const [x, y] = pointOn(curves[curve], flow === "in" ? t : 1 - t);
    return {
      transform: `translate(${flow === "in" ? x : 100 - x}cqw, ${y}cqh) translate(-50%, -50%)`,
      opacity: tokenOpacity(t),
      digit: tokenDigit(index, lap),
    };
  };

  useMotionValueEvent(time, "change", (now) => {
    tokens.current.forEach((el, i) => {
      if (!el) return;
      const { transform, opacity, digit } = place(i, now);
      el.style.transform = transform;
      el.style.opacity = String(opacity);
      if (flow === "in" && el.textContent !== digit) el.textContent = digit;
    });
  });

  const now = time.get();
  return (
    <div aria-hidden data-fan={flow} className={cn("[container-type:size]", className)}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className={cn("absolute inset-0 size-full overflow-visible text-primary", flow === "out" && "-scale-x-100")}
      >
        {curves.map((curve, i) => (
          <path
            key={i}
            d={curvePath(curve)}
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            strokeDasharray="1 3"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {Array.from({ length: tokenCount[flow] }, (_, i) => {
        const { transform, opacity, digit } = place(i, now);
        return (
          <span
            key={i}
            ref={(el) => {
              tokens.current[i] = el;
            }}
            data-fan-token
            className={cn(
              "absolute top-0 left-0 text-primary will-change-transform",
              flow === "in" ? `font-mono ${typeClass("micro")}` : "size-[3px] bg-primary",
            )}
            style={{ transform, opacity }}
          >
            {flow === "in" ? digit : null}
          </span>
        );
      })}
    </div>
  );
}
