import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TetrisField } from "@/features/tetris";

const size = { cols: 22, rows: 10, visibleRows: 9.4, seed: 7 };

describe("TetrisField", () => {
  it("keeps the game out of the accessibility tree", () => {
    const { container } = render(<TetrisField {...size} />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("replays the same opening from the same seed", () => {
    const first = render(<TetrisField {...size} />).container.innerHTML;
    const second = render(<TetrisField {...size} />).container.innerHTML;
    expect(first).toBe(second);
    expect(first).toContain("<rect");
  });

  // Pieces fall in from above, so a cut-off row belongs at the top.
  it("shows the bottom of the board, cutting off only the top", () => {
    const { container } = render(<TetrisField {...size} />);
    const [x, y, width, height] = container.querySelector("svg")!.getAttribute("viewBox")!.split(" ").map(Number);
    expect([x, width]).toEqual([0, 22]);
    expect(y).toBeCloseTo(0.6);
    expect(height).toBeCloseTo(9.4);
  });
});
