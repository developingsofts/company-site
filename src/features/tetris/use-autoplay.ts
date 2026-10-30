"use client";

import { useReducedMotion } from "motion/react";
import { type RefObject, useEffect, useEffectEvent, useRef, useState } from "react";
import { autoplayer } from "./autoplayer";
import { type Game, step } from "./game";

// The rules' pace: each tick turns or shifts the piece one step, and a row
// falls every few ticks. The board draws the piece gliding between ticks.
export const tickMs = 150;

/** The latest game and when its tick began, for drawing between ticks. */
export interface GameClock {
  game: Game;
  /** `performance.now()` at the start of the current tick. */
  tickStart: number;
}

/**
 * Plays `initial` on by itself while `target` is on screen. Under reduced
 * motion the board holds still.
 */
export function useAutoplay(
  target: RefObject<Element | null>,
  initial: () => Game,
): { game: Game; clock: RefObject<GameClock | null> } {
  const reduce = useReducedMotion();
  const [game, setGame] = useState(initial);
  const [onScreen, setOnScreen] = useState(false);
  const clock = useRef<GameClock | null>(null);
  // Where to pick the game up when the loop (re)starts, without restarting it
  // every time the game moves on.
  const resumeFrom = useEffectEvent(() => game);

  useEffect(() => {
    const el = target.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  useEffect(() => {
    if (reduce || !onScreen) {
      clock.current = null;
      return;
    }
    // From here the loop's own copy is the source of truth, so the drawing
    // loop and React see the same game on the same frame.
    let current = resumeFrom();
    clock.current = { game: current, tickStart: performance.now() };
    const timer = setInterval(() => {
      current = step(current, autoplayer);
      clock.current = { game: current, tickStart: performance.now() };
      setGame(current);
    }, tickMs);
    return () => clearInterval(timer);
  }, [reduce, onScreen]);

  return { game, clock };
}
