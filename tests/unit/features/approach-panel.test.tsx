import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { home } from "@/content/home";
import { ApproachPanel } from "@/features/home";

describe("ApproachPanel", () => {
  it("is a region named by its headline", () => {
    render(<ApproachPanel />);
    expect(screen.getByRole("region", { name: home.approach.headline.join(" ") })).toHaveAttribute("id", "approach");
  });

  it("pairs every credit with who does it", () => {
    render(<ApproachPanel />);
    const terms = screen.getAllByRole("term");
    expect(terms).toHaveLength(home.approach.credits.length);
    for (const [i, term] of terms.entries()) {
      const { role, by } = home.approach.credits[i];
      expect(within(term).getByText(role)).toBeInTheDocument();
      expect(within(term.parentElement!).getByRole("definition")).toContainElement(
        within(term.parentElement!).getByText(by),
      );
    }
  });
});
