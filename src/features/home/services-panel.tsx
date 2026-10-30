import type { CSSProperties } from "react";
import { home } from "@/content/home";
import { fontWeights } from "@/lib/font-weight";
import { typeClass } from "@/lib/type-scale";
import { PinnedStage } from "./pinned-stage";
import { ServiceShowcase } from "./service-showcase";
import { dwellFor } from "./stack-motion";

const headingScale = {
  "--fs-display": "clamp(2rem, min(4.5vw, 7svh), 3.5rem)",
  "--lh-display": "1.05",
} as CSSProperties;

/**
 * The services, in the primary colour: once the panel has slid in it holds
 * still while the scroll stacks a block per service.
 */
export function ServicesPanel() {
  const { heading, intro, items } = home.services;
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="row-span-2 grid grid-rows-subgrid bg-primary text-primary-foreground"
    >
      <PinnedStage dwell={dwellFor(items.length)}>
        <div className="flex flex-col gap-4 px-6 pt-16 pb-2 md:flex-row md:justify-between md:gap-16 md:px-14 md:pt-14">
          <h2
            id="services-heading"
            className={`text-balance ${typeClass("display")}`}
            style={{ ...headingScale, fontVariationSettings: fontWeights.semibold }}
          >
            {heading}
          </h2>
          <p className={`max-w-md md:pt-2 ${typeClass("title")}`}>{intro}</p>
        </div>
        <ServiceShowcase />
      </PinnedStage>
    </section>
  );
}
