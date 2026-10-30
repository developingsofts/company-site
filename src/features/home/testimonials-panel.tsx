import type { CSSProperties } from "react";
import { home } from "@/content/home";
import { fontWeights } from "@/lib/font-weight";
import { typeClass } from "@/lib/type-scale";
import { TestimonialCarousel } from "./testimonial-carousel";

const headingScale = {
  "--fs-display": "clamp(2rem, 4.5vw, 3.5rem)",
  "--lh-display": "1.05",
} as CSSProperties;

/** What clients say, one at a time, with a way to join them. */
export function TestimonialsPanel() {
  const { heading, intro } = home.testimonials;
  return (
    <section id="clients" aria-labelledby="clients-heading" className="border-t pt-16 md:pt-24">
      <div className="flex flex-col gap-6 px-6 pb-12 md:flex-row md:justify-between md:gap-16 md:px-14 md:pb-20">
        <h2
          id="clients-heading"
          className={`max-w-[12ch] text-balance ${typeClass("display")}`}
          style={{ ...headingScale, fontVariationSettings: fontWeights.semibold }}
        >
          {heading}
        </h2>
        <p className={`max-w-md text-muted-foreground ${typeClass("title")}`}>{intro}</p>
      </div>
      <TestimonialCarousel labelledBy="clients-heading" />
    </section>
  );
}
