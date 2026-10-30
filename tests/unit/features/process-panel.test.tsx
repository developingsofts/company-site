import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { home } from "@/content/home";
import { ProcessPanel } from "@/features/home";

const { heading, intro, steps } = home.process;

describe("ProcessPanel", () => {
  it("is a region named by its heading", () => {
    render(<ProcessPanel />);
    const region = screen.getByRole("region", { name: heading });
    expect(region).toHaveAttribute("id", "process");
    expect(within(region).getByText(intro)).toBeInTheDocument();
  });

  it("lists the steps in order, each with its heading and what it covers", () => {
    render(<ProcessPanel />);
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(steps.length);
    for (const [i, item] of items.entries()) {
      expect(within(item).getByRole("heading", { level: 3 })).toHaveTextContent(steps[i].title);
      expect(item).toHaveTextContent(steps[i].body);
    }
  });

  it("keeps the moving drawing out of the accessibility tree", () => {
    const { container } = render(<ProcessPanel />);
    for (const el of container.querySelectorAll("[data-fan], [data-flow-line], svg")) {
      expect(el.closest("[aria-hidden='true']")).not.toBeNull();
    }
  });

  it("streams digits in on one side and squares out on the other", () => {
    const { container } = render(<ProcessPanel />);
    const digits = container.querySelectorAll("[data-fan='in'] [data-fan-token]");
    const squares = container.querySelectorAll("[data-fan='out'] [data-fan-token]");
    expect(digits.length).toBeGreaterThan(10);
    for (const d of digits) expect(d.textContent).toMatch(/^[0-9a-f]$/);
    expect(squares.length).toBeGreaterThan(10);
  });
});
