import type { CSSProperties } from "react";
import { home } from "@/content/home";
import { fontWeights } from "@/lib/font-weight";
import { typeClass } from "@/lib/type-scale";
import { ProcessDiagram } from "./process-diagram";

const headingScale = {
  "--fs-display": "clamp(2rem, 4.5vw, 3.5rem)",
  "--lh-display": "1.05",
} as CSSProperties;

/** How the work runs, from scope to handover, reached by scrolling down past the sideways chapter. */
export function ProcessPanel() {
  const { heading, intro } = home.process;
  return (
    // Clipped sideways only: the fans start off the edges and slide in.
    <section id="process" aria-labelledby="process-heading" className="overflow-x-clip border-t pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="flex flex-col gap-6 px-6 md:flex-row md:justify-between md:gap-16 md:px-14">
        <h2
          id="process-heading"
          className={`max-w-[12ch] text-balance ${typeClass("display")}`}
          style={{ ...headingScale, fontVariationSettings: fontWeights.semibold }}
        >
          {heading}
        </h2>
        <p className={`max-w-md text-muted-foreground ${typeClass("title")}`}>{intro}</p>
      </div>
      <div className="mt-14 md:mt-48">
        <ProcessDiagram />
      </div>
    </section>
  );
}
