"use client";

import { AnimatePresence, motion } from "motion/react";
import { home } from "@/content/home";
import { HoverReveal } from "@/features/site";
import { fontWeights } from "@/lib/font-weight";
import { spring } from "@/lib/springs";
import { typeClass } from "@/lib/type-scale";
import type { Testimonial } from "./testimonial-slide";

/** The next testimonial in short, under the current one; clicking it moves the carousel on. */
export function UpNext({ testimonial, onClick }: { testimonial: Testimonial; onClick: () => void }) {
  const { name, role, company, quote } = testimonial;
  return (
    <button
      type="button"
      aria-label={`${home.testimonials.next}: ${name}`}
      onClick={onClick}
      className="flex size-full px-6 py-8 text-left md:px-14 md:py-10"
    >
      <span className="grid w-full border-l border-dashed border-primary pl-6">
        <AnimatePresence initial={false}>
          <motion.span
            key={name}
            className="flex flex-col gap-3 [grid-area:1/1]"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0, transition: spring.slow }}
            exit={{ opacity: 0, x: -16, transition: spring.slow.exit }}
          >
            <span className={`line-clamp-2 ${typeClass("title")}`}>{quote}</span>
            <span className={`font-mono text-muted-foreground ${typeClass("body")}`}>
              {`${name} // ${role}`}
            </span>
            <span className={typeClass("title")} style={{ fontVariationSettings: fontWeights.semibold }}>
              <HoverReveal>{company}</HoverReveal>
            </span>
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
}
