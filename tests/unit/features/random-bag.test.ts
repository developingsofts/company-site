import { describe, expect, it } from "vitest";
import { type Kind, createBag, draw, kinds } from "@/features/tetris";

function deal(seed: number, count: number): Kind[] {
  let bag = createBag(seed);
  const out: Kind[] = [];
  for (let i = 0; i < count; i++) {
    const [kind, next] = draw(bag);
    out.push(kind);
    bag = next;
  }
  return out;
}

describe("random bag", () => {
  it("deals every piece exactly once per seven", () => {
    const dealt = deal(42, 70);
    for (let i = 0; i < dealt.length; i += 7) {
      expect([...dealt.slice(i, i + 7)].sort()).toEqual([...kinds].sort());
    }
  });

  // The server and the browser must deal the same game, or the pre-played
  // board fails to hydrate.
  it("deals the same pieces for the same seed", () => {
    expect(deal(7, 30)).toEqual(deal(7, 30));
    expect(deal(7, 30)).not.toEqual(deal(8, 30));
  });
});
