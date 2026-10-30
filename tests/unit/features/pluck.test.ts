import { describe, expect, it } from "vitest";
import { pluck } from "@/features/site";

// A 1000×48 strip: the line runs along y = 24.
const at = (x: number, y: number, grabbed: boolean) => pluck(x, y, 1000, 48, grabbed, 5, 100);

describe("pluck", () => {
  it("catches the line only within reach of it", () => {
    expect(at(500, 27, false).grabbed).toBe(true);
    expect(at(500, 40, false).grabbed).toBe(false);
  });

  it("keeps hold further out than it catches, until the edge of the strip", () => {
    expect(at(500, 40, true).grabbed).toBe(true);
    expect(at(500, 49, true).grabbed).toBe(false);
    expect(at(-1, 24, true).grabbed).toBe(false);
  });

  it("pulls the control point past the pointer, on the pointer's side", () => {
    const { control } = at(300, 34, true);
    expect(control.x).toBe(300);
    expect(control.y).toBeGreaterThan(34);
    expect(at(300, 14, true).control.y).toBeLessThan(14);
  });
});
