import type { CSSProperties } from "react";
import type { home } from "@/content/home";
import { fontWeights } from "@/lib/font-weight";
import { typeClass } from "@/lib/type-scale";

export type Testimonial = (typeof home.testimonials.items)[number];

// Rounded to whole pixels: a fractional line box leaves the page a fraction of
// a pixel taller than any scroll position can reach, so contact never sits
// flush with the top of the screen.
const quoteScale = {
  "--fs-display": "clamp(1.125rem, 1.7vw, 1.5rem)",
  "--lh-display": "round(1.45em, 1px)",
} as CSSProperties;

/** One client's words: their company as a nameplate, the quote, and who said it. */
export function TestimonialSlide({ testimonial }: { testimonial: Testimonial }) {
  const { name, role, company, quote } = testimonial;
  return (
    <figure className="flex h-full flex-col">
      <p
        className={`self-start border border-primary px-3 py-1.5 ${typeClass("title")}`}
        style={{ fontVariationSettings: fontWeights.semibold }}
      >
        {company}
      </p>
      <blockquote
        className={`mt-8 mb-10 md:mt-10 md:mb-14 ${typeClass("display")}`}
        style={{ ...quoteScale, fontVariationSettings: fontWeights.normal }}
      >
        <p>{quote}</p>
      </blockquote>
      <figcaption className={`mt-auto border-t border-dashed border-primary pt-5 font-mono ${typeClass("body")}`}>
        {name} <span className="text-muted-foreground">{`// ${role}`}</span>
      </figcaption>
    </figure>
  );
}
