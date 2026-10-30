import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { HeroAside } from "@/features/home";

describe("HeroAside", () => {
  it("gives every promise a card titled by its heading, with its explanation", () => {
    render(<HeroAside />);
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings.map((h) => h.textContent)).toEqual(home.hero.promises.map((p) => p.title));
    for (const [i, heading] of headings.entries()) {
      expect(heading.nextElementSibling).toHaveTextContent(home.hero.promises[i].detail);
    }
  });

  it("leads to the contact section", () => {
    render(<HeroAside />);
    expect(screen.getByRole("link", { name: site.cta.label })).toHaveAttribute("href", site.cta.href);
  });
});
