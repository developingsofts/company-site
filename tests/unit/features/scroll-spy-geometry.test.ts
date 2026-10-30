import { describe, expect, it } from "vitest";
import { activeSection, scrollForSection } from "@/features/site";

// Three panels: 0–1440, 1440–1888 and 1888–2400, in a 1280px viewport.
const starts = [0, 1440, 1888];
const size = 1280;
const max = 2400 - size;
const offset = 96;
const at = (scroll: number) => ({ size, scroll, max });
const edges = (scroll: number) => starts.map((s, i) => ({ id: `s${i}`, start: s - scroll }));

describe("activeSection", () => {
  it("reads the first section at the start and the last at the end", () => {
    expect(activeSection(edges(0), at(0), offset)).toBe("s0");
    expect(activeSection(edges(max), at(max), offset)).toBe("s2");
  });

  it("never moves backwards as the track scrolls forwards", () => {
    let previous = 0;
    for (let scroll = 0; scroll <= max; scroll += 8) {
      const index = Number(activeSection(edges(scroll), at(scroll), offset).slice(1));
      expect(index).toBeGreaterThanOrEqual(previous);
      previous = index;
    }
  });

  it("is empty with no sections", () => {
    expect(activeSection([], at(0), offset)).toBe("");
  });
});

describe("scrollForSection", () => {
  const target = (i: number) => scrollForSection(starts[i], starts[i + 1], at(0), offset);

  it("scrolls each section to where it is the one being read", () => {
    starts.forEach((_, i) => {
      const scroll = target(i);
      expect(activeSection(edges(scroll), at(scroll), offset)).toBe(`s${i}`);
    });
  });

  it("brings the first and last sections fully into view", () => {
    expect(target(0)).toBe(0);
    expect(target(starts.length - 1)).toBe(max);
  });

  it("puts a section's left edge at the screen's edge when the next one stays out of the read", () => {
    const wide = [0, 400, 3000];
    const view = { size, scroll: 0, max: 3600 - size };
    expect(scrollForSection(wide[1], wide[2], view, offset)).toBe(400);
  });

  it("stays inside the scroll range", () => {
    expect(scrollForSection(99_999, undefined, at(0), offset)).toBe(max);
    expect(scrollForSection(500, undefined, { size, scroll: 0, max: 0 }, offset)).toBe(0);
  });
});
