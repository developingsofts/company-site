"use client";

import { QuotesIcon } from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, type PanInfo, motion } from "motion/react";
import { useState } from "react";
import { home } from "@/content/home";
import { useTouchPrimary } from "@/hooks/use-touch-primary";
import { spring } from "@/lib/springs";
import { CarouselControls } from "./carousel-controls";
import { ClientArt } from "./client-art";
import { JoinClients } from "./join-clients";
import { TestimonialSlide } from "./testimonial-slide";
import { UpNext } from "./up-next";

/** How far a swipe has to travel, in px, to change the slide. */
const swipe = 60;

const slide = {
  enter: (direction: number) => ({ opacity: 0, x: 32 * direction }),
  centre: { opacity: 1, x: 0, transition: spring.slow },
  exit: (direction: number) => ({ opacity: 0, x: -32 * direction, transition: spring.slow.exit }),
};

/**
 * The testimonials one at a time, beside a drawing of the client, with the
 * next one previewed underneath. Every slide is also laid out invisibly in
 * the same cell, so the carousel keeps the height of its longest quote and
 * nothing below it jumps as the slides change.
 */
export function TestimonialCarousel({ labelledBy }: { labelledBy: string }) {
  const { items, carousel, slide: slideLabel, of } = home.testimonials;
  const [[index, direction], setPage] = useState([0, 1]);
  const touch = useTouchPrimary();
  const count = items.length;

  const go = (to: number, step: number) => setPage([(to + count) % count, step]);
  const previous = () => go(index - 1, -1);
  const next = () => go(index + 1, 1);
  const onDragEnd = (_: unknown, { offset }: PanInfo) => {
    if (offset.x < -swipe) next();
    else if (offset.x > swipe) previous();
  };

  return (
    <div role="group" aria-roledescription={carousel} aria-labelledby={labelledBy}>
      <div className="grid border-y border-dashed border-primary md:grid-cols-[minmax(0,5fr)_minmax(0,11fr)]">
        <div className="h-72 border-b border-dashed border-primary md:h-auto md:border-r md:border-b-0">
          <ClientArt index={index} />
        </div>
        <div className="relative flex flex-col gap-10 overflow-x-clip px-6 py-10 md:px-14 md:py-14">
          <QuotesIcon
            aria-hidden
            weight="fill"
            className="absolute top-10 right-6 size-8 text-primary md:top-14 md:right-14"
          />
          <motion.div
            className="grid flex-1"
            drag={touch ? "x" : false}
            dragSnapToOrigin
            dragElastic={0.2}
            onDragEnd={onDragEnd}
          >
            {items.map((item) => (
              <div key={item.id} aria-hidden inert className="invisible [grid-area:1/1]">
                <TestimonialSlide testimonial={item} />
              </div>
            ))}
            <div aria-live="polite" className="grid [grid-area:1/1]">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={items[index].id}
                  role="group"
                  aria-roledescription={slideLabel}
                  aria-label={`${index + 1} ${of} ${count}`}
                  className="[grid-area:1/1]"
                  custom={direction}
                  variants={slide}
                  initial="enter"
                  animate="centre"
                  exit="exit"
                >
                  <TestimonialSlide testimonial={items[index]} />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
          <CarouselControls
            names={items.map((item) => item.name)}
            index={index}
            onSelect={(to) => go(to, to < index ? -1 : 1)}
            onPrevious={previous}
            onNext={next}
          />
        </div>
      </div>
      <div className="grid border-b border-dashed border-primary md:grid-cols-2">
        <UpNext testimonial={items[(index + 1) % count]} onClick={next} />
        <JoinClients />
      </div>
    </div>
  );
}
