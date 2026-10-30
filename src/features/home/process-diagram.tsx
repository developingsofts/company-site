"use client";

import { ArrowsClockwiseIcon, BrainIcon, FrameCornersIcon, PackageIcon } from "@phosphor-icons/react/dist/ssr";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { type CSSProperties, useRef } from "react";
import { home } from "@/content/home";
import { fontWeights } from "@/lib/font-weight";
import { typeClass } from "@/lib/type-scale";
import { DataFan } from "./data-fan";
import { FlowClock } from "./flow-clock";
import { FlowLine } from "./flow-line";
import { IsoGlyph } from "./iso-glyph";

const icons = {
  scoping: FrameCornersIcon,
  development: ArrowsClockwiseIcon,
  delivery: PackageIcon,
  training: BrainIcon,
} as const;

const titleScale = {
  "--fs-display": "clamp(1.375rem, 2.2vw, 1.875rem)",
  "--lh-display": "1.2",
} as CSSProperties;

/** How far off the side, in fan widths, each fan starts before the scroll brings it in. */
const fanReach = 0.4;

/**
 * The process as a flow: raw digits pour in from the left, run through the
 * four steps and leave on the right as finished squares. The stream runs
 * while it is on screen, and the fans slide in as it scrolls up the screen.
 */
export function ProcessDiagram() {
  const { steps } = home.process;
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const arrived = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
  const fanIn = useTransform(() => {
    const shift = (arrived.get() - 1) * fanReach * 100;
    return `${reduce ? 0 : shift}%`;
  });
  const fanOut = useTransform(() => {
    const shift = (1 - arrived.get()) * fanReach * 100;
    return `${reduce ? 0 : shift}%`;
  });

  return (
    <FlowClock className="px-6 [--fan:clamp(5rem,12vw,15rem)] md:px-[var(--fan)]">
      <div ref={ref} className="relative">
        {/* Both fans centre on the row of icons, half their height (3.5rem) down. */}
        <motion.div
          className="absolute top-14 right-full hidden h-[clamp(18rem,40svh,24rem)] w-[var(--fan)] -translate-y-1/2 md:block"
          style={{ x: fanIn, opacity: arrived }}
        >
          <DataFan flow="in" className="relative size-full" />
        </motion.div>
        <motion.div
          className="absolute top-14 left-full hidden h-[clamp(18rem,40svh,24rem)] w-[var(--fan)] -translate-y-1/2 md:block"
          style={{ x: fanOut, opacity: arrived }}
        >
          <DataFan flow="out" className="relative size-full" />
        </motion.div>

        <ol className="grid gap-x-4 gap-y-12 sm:grid-cols-2 md:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.id} className="relative flex flex-col items-center">
              <IsoGlyph icon={icons[step.id]} className="size-28" />
              {i < steps.length - 1 && (
                // From just past this icon to just short of the next one.
                <FlowLine
                  axis="x"
                  packets={3}
                  offset={i * 0.3}
                  className="absolute top-14 left-[calc(50%+4rem)] hidden w-[calc(100%+1rem-8rem)] md:block"
                />
              )}
              <FlowLine axis="y" packets={1} offset={i * 0.25} className="h-10 md:h-20" />
              <div className="flex w-full flex-1 flex-col gap-4 border border-primary p-5 md:p-7">
                <h3 className={typeClass("display")} style={{ ...titleScale, fontVariationSettings: fontWeights.semibold }}>
                  {step.title}
                </h3>
                <p className={`text-muted-foreground ${typeClass("title")}`}>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </FlowClock>
  );
}
