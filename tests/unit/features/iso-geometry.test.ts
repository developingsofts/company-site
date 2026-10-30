import { describe, expect, it } from "vitest";
import { blockViewBox, project } from "@/features/home";

describe("iso geometry", () => {
  it("projects the flat face's corners to an isometric diamond", () => {
    const [back, right, front, left] = [project(0, 0), project(100, 0), project(100, 100), project(0, 100)];
    expect(back).toEqual([0, 0]);
    expect(front[0]).toBeCloseTo(0);
    expect(front[1]).toBe(100);
    expect(right[0]).toBeCloseTo(-left[0]);
    expect(right[1]).toBe(50);
    // 30 degree slopes: the diamond is twice as wide as it is tall, over √3.
    expect((right[0] - left[0]) / (front[1] - back[1])).toBeCloseTo(Math.sqrt(3));
  });

  it("frames the whole slab, centred on the face's axis", () => {
    const [x, , width] = blockViewBox;
    expect(x + width / 2).toBeCloseTo(0);
    expect(width).toBeGreaterThan(0);
  });
});
