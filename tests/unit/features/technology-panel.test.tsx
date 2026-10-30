import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { home } from "@/content/home";
import { TechnologyPanel } from "@/features/home";

const { heading, intro, groups } = home.technology;

describe("TechnologyPanel", () => {
  it("is a region named by its heading", () => {
    render(<TechnologyPanel />);
    const region = screen.getByRole("region", { name: heading });
    expect(region).toHaveAttribute("id", "technology");
    expect(within(region).getByText(intro)).toBeInTheDocument();
  });

  it("lists every technology under its group for assistive tech", () => {
    render(<TechnologyPanel />);
    const titles = screen.getAllByRole("heading", { level: 3 });
    const lists = screen.getAllByRole("list");
    expect(titles.map((t) => t.textContent)).toEqual(groups.map((g) => g.label));
    for (const [i, group] of groups.entries()) {
      const items = within(lists[i]).getAllByRole("listitem").map((li) => li.textContent);
      expect(items).toEqual([...group.items]);
    }
  });

  it("runs each group along its own band, out of the accessibility tree", () => {
    const { container } = render(<TechnologyPanel />);
    const bands = [...container.querySelectorAll("svg")];
    expect(bands).toHaveLength(groups.length);
    for (const [i, band] of bands.entries()) {
      expect(band.closest("[aria-hidden='true']")).not.toBeNull();
      const text = band.querySelector("textPath")!.textContent;
      for (const item of groups[i].items) expect(text).toContain(item);
    }
  });
});
