"use client";

import type { MotionValue } from "motion/react";
import type { ReactNode } from "react";
import { blockAspect } from "./iso-geometry";
import { StackBlock } from "./stack-block";

interface ServiceStackProps {
  /** One drawing per block, bottom of the stack first. */
  arts: readonly ReactNode[];
  progress: MotionValue<number>;
  /** The block shown on its own, or null for the whole stack. */
  shown: number | null;
}

/**
 * The services stack: blocks fly in from the left as the stage scrolls and
 * land on top of one another. Showing one block clears the rest away.
 */
export function ServiceStack({ arts, progress, shown }: ServiceStackProps) {
  return (
    // Sized against both its width and its height, so the block and the two
    // levels stacked above it always fit. Clipped sideways only: blocks fly in
    // from behind the column's left edge, and a landing one may rise above it.
    <div aria-hidden data-service-stack className="relative h-full w-full overflow-x-clip [container-type:size]">
      <div
        className="absolute inset-x-0 bottom-0 mx-auto w-[min(100cqw,85cqh)]"
        style={{ aspectRatio: blockAspect }}
      >
        {arts.map((art, i) => (
          <StackBlock
            key={i}
            index={i}
            count={arts.length}
            progress={progress}
            shown={shown === i}
            cleared={shown !== null && shown !== i}
            art={art}
          />
        ))}
      </div>
    </div>
  );
}
