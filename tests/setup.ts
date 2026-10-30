import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll } from "vitest";

// happy-dom has no layout, so anything that measures (fluid hover, scroll
// fades) is checked in the Playwright suite. These stand-ins only keep
// components from throwing when they ask for browser APIs.

export let reduceMotion = false;
export const setReduceMotion = (on: boolean) => {
  reduceMotion = on;
};

beforeAll(() => {
  window.matchMedia = (query: string) =>
    ({
      matches: query.includes("prefers-reduced-motion") ? reduceMotion : false,
      media: query,
      onchange: null,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent: () => false,
    }) as MediaQueryList;

  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  globalThis.IntersectionObserver ??= class {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  } as unknown as typeof IntersectionObserver;

  if (!document.fonts) {
    Object.defineProperty(document, "fonts", { value: { ready: Promise.resolve() } });
  }

  // happy-dom ships a partial Web Animations API whose cancel() rejects the
  // `finished` promise Motion never awaits, so every interrupted exit throws
  // an unhandled rejection. Without it Motion animates on its own timer.
  delete (Element.prototype as Partial<Element>).animate;
});

afterEach(() => {
  cleanup();
  setReduceMotion(false);
});
