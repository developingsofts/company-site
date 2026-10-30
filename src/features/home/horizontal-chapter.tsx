"use client";

import { motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { type ReactNode, useEffect, useRef } from "react";

/**
 * A stretch of the page that reads sideways. It pins to the screen and turns
 * the page's own vertical scroll into sideways travel, pixel for pixel, then
 * lets go and the page carries on downwards. Wheel, trackpad, keys, touch and
 * the scrollbar all work as on any page, because the page is what scrolls.
 *
 * The track is two rows tall: a band and a body. A panel can span both as a
 * subgrid (`row-span-2 grid grid-rows-subgrid`), so every banded panel's band
 * ends on the same line however much text it holds. Panels size against the
 * chapter's width with `cqw`, which, unlike `vw`, leaves out a scrollbar.
 */
export function HorizontalChapter({ children }: { children: ReactNode }) {
  const chapterRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const travel = useMotionValue(0);
  const top = useMotionValue(0);
  // The page's scroll, not progress through the chapter: progress is only
  // recomputed on scroll, so it would go stale when the chapter first takes
  // its length and show the track's far end before the reader has moved.
  const { scrollY } = useScroll();
  // Whole pixels: a fractional translate resamples every glyph and blurs text.
  const x = useTransform(() => -Math.round(Math.min(travel.get(), Math.max(0, scrollY.get() - top.get()))));
  const height = useTransform(() => `calc(100svh + ${travel.get()}px)`);

  useEffect(() => {
    const chapter = chapterRef.current;
    const track = trackRef.current;
    if (!chapter || !track) return;
    const measure = () => {
      travel.set(Math.max(0, track.scrollWidth - chapter.clientWidth));
      top.set(chapter.getBoundingClientRect().top + window.scrollY);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(chapter);
    observer.observe(track);
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, [travel, top]);

  return (
    <motion.div ref={chapterRef} data-chapter style={{ height }}>
      <div className="@container sticky top-0 h-svh overflow-clip">
        <motion.div
          ref={trackRef}
          data-chapter-track
          className="relative grid h-full w-max grid-flow-col grid-rows-[auto_minmax(0,1fr)]"
          style={{ x }}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
}
