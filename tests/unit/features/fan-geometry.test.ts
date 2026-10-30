import { describe, expect, it } from "vitest";
import { fanCurves, fanFocus, pointOn, tokenAt, tokenDigit, tokenOpacity } from "@/features/home";

describe("fan geometry", () => {
  it("spreads the curves down the outer edge and gathers them at the focus", () => {
    const curves = fanCurves(9);
    const starts = curves.map((c) => pointOn(c, 0));
    for (const [x] of starts) expect(x).toBe(0);
    expect(starts.map(([, y]) => y)).toEqual([...starts.map(([, y]) => y)].sort((a, b) => a - b));
    for (const c of curves) expect(pointOn(c, 1)).toEqual(fanFocus);
  });

  it("moves every token along its curve as time passes, and brings it round again", () => {
    const start = tokenAt(3, 0, 9);
    const later = tokenAt(3, 0.5, 9);
    expect(later.curve).toBe(start.curve);
    expect(later.t).not.toBe(start.t);
    const laps = tokenAt(3, 60, 9).lap;
    expect(laps).toBeGreaterThan(start.lap);
    expect(tokenAt(3, 60, 9).t).toBeGreaterThanOrEqual(0);
    expect(tokenAt(3, 60, 9).t).toBeLessThan(1);
  });

  it("spreads tokens along the fan from the first frame", () => {
    const along = Array.from({ length: 20 }, (_, i) => tokenAt(i, 0, 9).t);
    expect(Math.min(...along)).toBeLessThan(0.2);
    expect(Math.max(...along)).toBeGreaterThan(0.8);
  });

  it("fades tokens in off the edge and out into the focus", () => {
    expect(tokenOpacity(0)).toBe(0);
    expect(tokenOpacity(0.5)).toBe(1);
    expect(tokenOpacity(1)).toBe(0);
  });

  it("gives a token a new digit each lap", () => {
    expect(tokenDigit(2, 0)).toMatch(/^[0-9a-f]$/);
    expect(tokenDigit(2, 1)).not.toBe(tokenDigit(2, 0));
  });
});
