"use client";

import { useMotionValueEvent } from "motion/react";
import { useState } from "react";
import { home } from "@/content/home";
import { AgentArt } from "./agent-art";
import { InfraArt } from "./infra-art";
import { PlatformArt } from "./platform-art";
import { ServiceAccordion } from "./service-accordion";
import { ServiceStack } from "./service-stack";
import { useStageProgress } from "./pinned-stage";
import { StoreArt } from "./store-art";
import { landedCount } from "./stack-motion";

const arts = {
  agents: <AgentArt />,
  commerce: <StoreArt />,
  platforms: <PlatformArt />,
  infrastructure: <InfraArt />,
} as const;

/** Stage widths of scrolling after a pick before the scroll takes the stack back. */
const pickHold = 0.15;

interface Pick {
  /** The item opened by hand, or null when it was closed by hand. */
  index: number | null;
  /** Stage progress when it was picked. */
  at: number;
}

/**
 * The services accordion beside their stack. Scrolling builds the stack and
 * opens the service on top of it; opening a service by hand shows its block
 * alone, until the reader scrolls on and the scroll takes over again.
 */
export function ServiceShowcase() {
  const { items } = home.services;
  const { raw, progress } = useStageProgress();
  const [landed, setLanded] = useState(() => landedCount(progress.get(), items.length));
  const [pick, setPick] = useState<Pick | null>(null);

  useMotionValueEvent(progress, "change", (p) => setLanded(landedCount(p, items.length)));
  useMotionValueEvent(raw, "change", (p) => {
    if (pick && Math.abs(p - pick.at) > pickHold) setPick(null);
  });

  const open = pick ? pick.index : landed > 0 ? landed - 1 : null;

  return (
    // The accordion hangs from its top edge and the stack's box never depends
    // on it, so opening a service only pushes the rows below it down: centred,
    // the whole list would drift while a panel grows, and on a phone a stack
    // sized by what is left over would rescale every frame.
    <div className="flex min-h-0 flex-col gap-4 px-6 pt-4 pb-6 md:flex-row md:gap-14 md:px-14 md:pt-10 md:pb-12">
      <div className="order-last shrink-0 md:order-none md:w-[min(32rem,42cqw)]">
        <ServiceAccordion
          items={items}
          open={open}
          onToggle={(i) => setPick({ index: open === i ? null : i, at: raw.get() })}
        />
      </div>
      <div className="h-[18svh] shrink-0 md:h-auto md:min-h-0 md:flex-1">
        <ServiceStack arts={items.map((item) => arts[item.id])} progress={progress} shown={pick?.index ?? null} />
      </div>
    </div>
  );
}
