"use client";

import { motion, useReducedMotion } from "motion/react";
import { Fragment } from "react";
import { spring } from "@/lib/springs";
import { cn } from "@/lib/utils";
import { useArrived } from "./arrival";

// Far enough down to clear the slot's descender room even at the tightest
// leading, so no tops of letters peek over the cut before the rise.
const below = "140%";

interface CutRevealProps {
  children: string;
  /** Seconds after arrival before the first word rises. */
  delay?: number;
  /** Seconds between one word rising and the next. */
  stagger?: number;
  /** Classes for each word's slot, e.g. `block` for a word a line. */
  wordClassName?: string;
}

/**
 * Text whose words rise into view through a cut, one after another, once its
 * page has arrived (see `Arrival`). Line breaks in the text are kept. Reads as
 * plain text to assistive tech; under reduced motion it is simply there.
 */
export function CutReveal({ children, delay = 0, stagger = 0.04, wordClassName }: CutRevealProps) {
  const arrived = useArrived();
  const reduce = useReducedMotion();
  const shown = arrived || reduce;
  let index = 0;
  return (
    <>
      <span className="sr-only">{children}</span>
      <span aria-hidden>
        {children.split("\n").map((line, l) => (
          <Fragment key={l}>
            {l > 0 && <br />}
            {line.split(" ").map((word, w) => {
              const at = delay + index++ * stagger;
              return (
                <Fragment key={w}>
                  {w > 0 && " "}
                  {/* The slot is the cut: it clips the word below it. Padding
                      and a matching negative margin make room for
                      descenders without moving the line. */}
                  <span className={cn("inline-block overflow-hidden pb-[0.15em] -mb-[0.15em] align-top", wordClassName)}>
                    <motion.span
                      data-cut-word
                      className="inline-block"
                      initial={reduce ? false : { y: below }}
                      animate={{ y: shown ? "0%" : below }}
                      transition={{ ...spring.slow, delay: at }}
                    >
                      {word}
                    </motion.span>
                  </span>
                </Fragment>
              );
            })}
          </Fragment>
        ))}
      </span>
    </>
  );
}
