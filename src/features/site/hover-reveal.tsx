"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { spring } from "@/lib/springs";

/** Seconds between one letter starting to roll and the next. */
const stagger = 0.015;

/**
 * Text that rolls on hover: while its link or button is hovered or focused,
 * each letter slides up out of its slot and a copy slides in from below, one
 * after another. Reads as plain text to assistive tech; under reduced motion
 * the copy swaps in place, so nothing visibly moves.
 */
export function HoverReveal({ children }: { children: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false);

  // The whole control is the hover target, padding included, not just the
  // letters.
  useEffect(() => {
    const target = ref.current?.closest("a, button") ?? ref.current?.parentElement;
    if (!target) return;
    const enter = () => setOn(true);
    const leave = () => setOn(false);
    const focus = () => setOn(target.matches(":focus-visible"));
    target.addEventListener("pointerenter", enter);
    target.addEventListener("pointerleave", leave);
    target.addEventListener("focus", focus);
    target.addEventListener("blur", leave);
    return () => {
      target.removeEventListener("pointerenter", enter);
      target.removeEventListener("pointerleave", leave);
      target.removeEventListener("focus", focus);
      target.removeEventListener("blur", leave);
    };
  }, []);

  const words = children.split(" ");
  let index = 0;
  return (
    <span ref={ref} data-hover-reveal={on ? "on" : "off"}>
      <span className="sr-only">{children}</span>
      <span aria-hidden className="whitespace-pre">
        {words.map((word, w) => (
          <span key={w}>
            {w > 0 && " "}
            {/* A word's letters stay together, so a wrap never splits it. */}
            <span className="inline-flex">
              {[...word].map((letter, l) => {
                const delay = index++ * stagger;
                return (
                  <span key={l} className="relative inline-block overflow-hidden">
                    <motion.span
                      className="relative inline-block"
                      initial={false}
                      animate={{ y: on ? "-100%" : "0%" }}
                      transition={{ ...spring.moderate, delay }}
                    >
                      {letter}
                      <span className="absolute top-full left-0">{letter}</span>
                    </motion.span>
                  </span>
                );
              })}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
