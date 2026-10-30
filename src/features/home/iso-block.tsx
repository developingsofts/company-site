"use client";

import { type MotionValue, motion } from "motion/react";
import type { ReactNode } from "react";
import { blockViewBox, facePath, frontEdgePath, isoMatrix, sideBand, sideEdges, slabThickness } from "./iso-geometry";

const strokeProps = {
  fill: "none",
  strokeWidth: 1,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  vectorEffect: "non-scaling-stroke",
} as const;

function Outline() {
  return (
    <g {...strokeProps}>
      <path d={facePath} transform={isoMatrix} />
      <path d={frontEdgePath} transform={`translate(0 ${slabThickness}) ${isoMatrix}`} />
      {sideEdges.map(({ x, top, bottom }) => (
        <line key={x} x1={x} y1={top} x2={x} y2={bottom} />
      ))}
    </g>
  );
}

interface IsoBlockProps {
  /** Drawn flat on the top face, in its 0–100 units; strokes and fills take `currentColor`. */
  art: ReactNode;
  fill: MotionValue<number>;
  ink: MotionValue<number>;
  ghost: MotionValue<number>;
}

/**
 * An isometric slab with a drawing on its top face, in three layers that fade
 * on their own: the solid body, the drawing with its outline in the panel's
 * colour, and a bare outline in the body's colour for when only its ghost is
 * left on the stack.
 */
export function IsoBlock({ art, fill, ink, ghost }: IsoBlockProps) {
  return (
    <svg viewBox={blockViewBox.join(" ")} className="block h-full w-full overflow-visible" aria-hidden>
      <motion.g className="fill-primary-foreground" style={{ opacity: fill }}>
        <path d={facePath} transform={`translate(0 ${slabThickness}) ${isoMatrix}`} />
        <rect {...sideBand} />
        <path d={facePath} transform={isoMatrix} />
      </motion.g>
      <motion.g className="stroke-primary text-primary" style={{ opacity: ink }}>
        <Outline />
        <g
          transform={isoMatrix}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="[&_*]:[vector-effect:non-scaling-stroke]"
        >
          {art}
        </g>
      </motion.g>
      <motion.g className="stroke-primary-foreground" style={{ opacity: ghost }}>
        <Outline />
      </motion.g>
    </svg>
  );
}
