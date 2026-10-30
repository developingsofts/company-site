"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { arrivalOf } from "./scroll-arrival";
import { type ScrollView, activeSection, scrollForSection } from "./scroll-spy-geometry";

export interface SpySection {
  id: string;
  label: string;
}

// Screen readers hear the section only once scrolling rests on it, not every
// section flicked past on the way.
const announceDelayMs = 420;

function pageView(): ScrollView {
  return {
    size: window.innerHeight,
    scroll: window.scrollY,
    max: document.documentElement.scrollHeight - window.innerHeight,
  };
}

/**
 * Tracks which of `sections` is being read as the page scrolls, whether a
 * section scrolls up into view or slides in sideways inside a chapter, and
 * scrolls to one on request. `offset` is how far into the scroll a section
 * has to come to count as read.
 */
export function useScrollSpy(sections: readonly SpySection[], offset: number) {
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [announce, setAnnounce] = useState("");
  const settled = useRef(false);
  // The section a click is scrolling to. While set, the sections passed on the
  // way are not shown as active; it clears on arrival or when the reader takes
  // over the scroll.
  const heading = useRef<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const sync = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const edges = sections.flatMap((s) => {
          const node = document.getElementById(s.id);
          return node ? [{ id: s.id, start: arrivalOf(node) - window.scrollY }] : [];
        });
        const next = activeSection(edges, pageView(), offset);
        if (!next) return;
        if (heading.current) {
          if (heading.current === next) heading.current = null;
          return;
        }
        setActiveId(next);
      });
    };
    const takeOver = () => {
      heading.current = null;
    };
    const arrive = () => {
      heading.current = null;
      sync();
    };
    const takeOverOn = ["wheel", "touchstart", "pointerdown", "keydown"] as const;

    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("scrollend", arrive);
    for (const type of takeOverOn) window.addEventListener(type, takeOver, { passive: true });
    const observer = new ResizeObserver(sync);
    observer.observe(document.documentElement);
    for (const s of sections) {
      const node = document.getElementById(s.id);
      if (node) observer.observe(node);
    }
    sync();

    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("scrollend", arrive);
      for (const type of takeOverOn) window.removeEventListener(type, takeOver);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [sections, offset]);

  useEffect(() => {
    if (!settled.current) {
      settled.current = true;
      return;
    }
    const timer = setTimeout(() => {
      setAnnounce(sections.find((s) => s.id === activeId)?.label ?? "");
    }, announceDelayMs);
    return () => clearTimeout(timer);
  }, [activeId, sections]);

  const scrollTo = (id: string) => {
    const node = document.getElementById(id);
    if (!node) return;
    heading.current = id;
    setActiveId(id);
    const after = sections[sections.findIndex((s) => s.id === id) + 1];
    const next = after && document.getElementById(after.id);
    window.scrollTo({
      top: scrollForSection(arrivalOf(node), next ? arrivalOf(next) : undefined, pageView(), offset),
      behavior: reduce ? "instant" : "smooth",
    });
    if (!node.hasAttribute("tabindex")) node.setAttribute("tabindex", "-1");
    node.focus({ preventScroll: true });
  };

  return { activeId, announce, scrollTo };
}
