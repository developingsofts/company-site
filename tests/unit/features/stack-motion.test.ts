import { describe, expect, it } from "vitest";
import { dwellFor, flightOf, isolatedPose, landedCount, stackPose } from "@/features/home";

const flights = (...f: number[]) => f;

describe("stack motion", () => {
  it("flies each block in once, the first landing as the stage arrives", () => {
    expect(flightOf(-1, 0)).toBe(0);
    expect(flightOf(0, 0)).toBe(1);
    // The next one waits until the first has landed.
    expect(flightOf(0, 1)).toBe(0);
    let last = 0;
    for (let p = -1; p <= 1; p += 0.01) {
      const f = flightOf(p, 1);
      expect(f).toBeGreaterThanOrEqual(last);
      last = f;
    }
    expect(last).toBe(1);
  });

  it("lands every block before the stage lets go", () => {
    expect(landedCount(-1, 4)).toBe(0);
    expect(landedCount(0, 4)).toBe(1);
    expect(landedCount(dwellFor(4), 4)).toBe(4);
  });

  it("keeps the top block solid, the one under it translucent and the next a bare outline", () => {
    const stack = flights(1, 1, 1);
    const [bottom, middle, top] = [0, 1, 2].map((i) => stackPose(stack, i, false));
    expect(top).toMatchObject({ fill: 1, ink: 1, ghost: 0, opacity: 1 });
    expect(middle.fill).toBeCloseTo(0.4);
    expect(middle).toMatchObject({ ink: 0, ghost: 1 });
    expect(bottom).toMatchObject({ fill: 0, ink: 0, ghost: 1 });
    expect(top.y).toBeLessThan(middle.y);
    expect(middle.y).toBeLessThan(bottom.y);
  });

  it("sinks the oldest block out of sight once a fourth lands", () => {
    expect(stackPose(flights(1, 1, 1, 1), 0, false).opacity).toBe(0);
  });

  it("brings a block in from the left and from above", () => {
    const flying = stackPose(flights(1, 0.5), 1, false);
    const landed = stackPose(flights(1, 1), 1, false);
    expect(flying.x).toBeLessThan(0);
    expect(landed.x).toBe(0);
    expect(flying.y).toBeLessThan(landed.y);
  });

  it("drops the flight under reduced motion, so a block only fades in where it lands", () => {
    const flying = stackPose(flights(1, 0.2), 1, true);
    expect(flying.x).toBe(0);
    expect(flying.y).toBe(stackPose(flights(1, 1), 1, true).y);
    expect(flying.opacity).toBeLessThan(1);
  });

  it("shows a picked block alone, solid at the base, and clears the rest", () => {
    const stack = flights(1, 1, 1);
    const picked = isolatedPose(stackPose(stack, 0, false), 1, 1);
    const other = isolatedPose(stackPose(stack, 2, false), 0, 1);
    expect(picked).toEqual({ x: 0, y: 0, opacity: 1, fill: 1, ink: 1, ghost: 0 });
    expect(other.opacity).toBe(0);
    expect(other.x).toBeGreaterThan(0);
  });

  it("leaves the stack untouched while nothing is picked", () => {
    const pose = stackPose(flights(1, 1), 0, false);
    expect(isolatedPose(pose, 0, 0)).toEqual(pose);
  });

  // Both blocks run their springs side by side; the picked one must not pass
  // through the cleared pose on its way down, or it flickers as it settles.
  it("never dims a picked block on its way to the base, nor brightens one being cleared", () => {
    const stack = flights(1, 1, 1);
    let picked = 0;
    let swappedOut = 1;
    let swappedIn = 0;
    for (let t = 0; t <= 1.0001; t += 0.05) {
      const down = isolatedPose(stackPose(stack, 1, false), t, 0).opacity;
      const out = isolatedPose(stackPose(stack, 1, false), 1 - t, t).opacity;
      const back = isolatedPose(stackPose(stack, 2, false), t, 1 - t).opacity;
      expect(down).toBeGreaterThanOrEqual(picked);
      expect(out).toBeLessThanOrEqual(swappedOut);
      expect(back).toBeGreaterThanOrEqual(swappedIn);
      [picked, swappedOut, swappedIn] = [down, out, back];
    }
    expect(picked).toBeCloseTo(1);
    expect(swappedOut).toBeCloseTo(0);
    expect(swappedIn).toBeCloseTo(1);
  });
});
