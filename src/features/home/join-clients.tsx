import { EnvelopeSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import type { CSSProperties } from "react";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { HoverReveal } from "@/features/site";
import { fontWeights } from "@/lib/font-weight";
import { typeClass } from "@/lib/type-scale";
import { IsoGlyph } from "./iso-glyph";

// Whole pixels, like the quote's: see testimonial-slide.tsx.
const headingScale = {
  "--fs-display": "clamp(1.5rem, 2.4vw, 2rem)",
  "--lh-display": "round(1.15em, 1px)",
} as CSSProperties;

/** The call to action beside the testimonials, on a block of the primary colour. */
export function JoinClients() {
  return (
    <div className="flex items-center justify-between gap-6 bg-primary px-6 py-8 text-primary-foreground md:px-14 md:py-10">
      <div className="flex flex-col items-start gap-6">
        <h3
          className={typeClass("display")}
          style={{ ...headingScale, fontVariationSettings: fontWeights.semibold }}
        >
          {home.testimonials.join}
        </h3>
        <a
          href={site.cta.href}
          className={`inline-flex h-9 items-center bg-primary-foreground px-4 font-mono text-primary ${typeClass("body")}`}
          style={{ fontVariationSettings: fontWeights.semibold }}
        >
          <HoverReveal>{site.cta.label}</HoverReveal>
        </a>
      </div>
      <IsoGlyph icon={EnvelopeSimpleIcon} inverse className="size-24 shrink-0 md:size-36" />
    </div>
  );
}
