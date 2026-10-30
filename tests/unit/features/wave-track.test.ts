import { describe, expect, it } from "vitest";
import { waveTrack } from "@/features/home";

const points = (d: string) =>
  [...d.matchAll(/[MQT]((?:\s+-?[\d.]+)+)/g)].map((m) => m[1].trim().split(/\s+/).map(Number));

describe("waveTrack", () => {
  it("runs along the middle from one half wave to another", () => {
    const d = waveTrack(170, -2, 3);
    expect(d.startsWith("M -1200 260")).toBe(true);
    expect(d.endsWith("T 1800 260")).toBe(true);
    for (const p of points(d)) expect(p.at(-1)).toBe(260);
  });

  it("puts each crest on the same side whichever half wave the track starts on", () => {
    const control = (d: string) => points(d)[1];
    // Half wave 0 starts at the left edge; the control point over it is the
    // one a track starting at -2 reaches through two reflections.
    expect(control(waveTrack(170, 0, 2))).toEqual([300, 90, 600, 260]);
    expect(control(waveTrack(170, -1, 2))).toEqual([-300, 430, 0, 260]);
    expect(control(waveTrack(170, -2, 2))).toEqual([-900, 90, -600, 260]);
  });

  it("mirrors the wave for a negative amplitude", () => {
    expect(points(waveTrack(-170, 0, 2))[1]).toEqual([300, 430, 600, 260]);
  });
});
