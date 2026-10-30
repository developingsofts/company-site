"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef } from "react";
import { fontWeights } from "@/lib/font-weight";
import { nestedRadius } from "@/lib/shape-context";
import { useSize } from "@/lib/size-context";
import { spring } from "@/lib/springs";
import { cn } from "@/lib/utils";
import { HoverReveal } from "./hover-reveal";
import { type SpySection, useScrollSpy } from "./use-scroll-spy";

const outerRadius = 10;
// The track pads its chips by 4px (`segmentPad`), so the thumb's corners
// stay concentric with the track's.
const innerRadius = nestedRadius(outerRadius, 4);

// How far into the screen a panel's left edge has to come to count as read.
const readOffset = 96;

interface SectionNavProps {
  sections: readonly SpySection[];
  label: string;
  className?: string;
}

/** A segmented strip of the page's panels; the thumb follows the sideways scroll. */
export function SectionNav({ sections, label, className }: SectionNavProps) {
  const { activeId, announce, scrollTo } = useScrollSpy(sections, readOffset);
  const size = useSize();
  const reduce = useReducedMotion();
  const thumbId = useId();
  const chips = useRef(new Map<string, HTMLElement>());

  // On a narrow header the strip scrolls; keep the active chip in it.
  useEffect(() => {
    chips.current.get(activeId)?.scrollIntoView({
      behavior: reduce ? "instant" : "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [activeId, reduce]);

  return (
    <nav aria-label={label} className={cn("min-w-0", className)}>
      <div className={cn("bg-muted", size.segmentPad)} style={{ borderRadius: outerRadius }}>
        <ol className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map((section) => {
            const active = section.id === activeId;
            return (
              <li
                key={section.id}
                ref={(el) => {
                  if (el) chips.current.set(section.id, el);
                  else chips.current.delete(section.id);
                }}
                className="relative flex-[1_0_auto]"
              >
                {active && (
                  <motion.span
                    aria-hidden
                    layoutId={thumbId}
                    transition={spring.moderate}
                    className="absolute inset-0 bg-primary"
                    style={{ borderRadius: innerRadius }}
                  />
                )}
                <a
                  href={`#${section.id}`}
                  aria-current={active ? "location" : undefined}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                    e.preventDefault();
                    scrollTo(section.id);
                  }}
                  className={cn(
                    "group relative flex w-full items-center justify-center px-2.5 font-mono",
                    size.segmentItem,
                    size.text,
                  )}
                  style={{ borderRadius: innerRadius }}
                >
                  {/* The heavier label sizes the chip, so turning active
                      never changes its width. */}
                  <span className="grid">
                    <span
                      aria-hidden
                      className="invisible col-start-1 row-start-1 whitespace-nowrap"
                      style={{ fontVariationSettings: fontWeights.semibold }}
                    >
                      {section.label}
                    </span>
                    <span
                      className={cn(
                        "col-start-1 row-start-1 whitespace-nowrap",
                        active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground",
                      )}
                      style={{ fontVariationSettings: active ? fontWeights.semibold : fontWeights.normal }}
                    >
                      <HoverReveal>{section.label}</HoverReveal>
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
    </nav>
  );
}
