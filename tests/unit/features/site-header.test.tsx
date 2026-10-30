import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { SiteHeader } from "@/features/site";

describe("SiteHeader", () => {
  it("links the site name home", () => {
    render(<SiteHeader sections={home.sections} />);
    expect(screen.getByRole("link", { name: site.name })).toHaveAttribute("href", "/");
  });

  it("lists the page's sections as the main navigation", () => {
    render(<SiteHeader sections={home.sections} />);
    const nav = screen.getByRole("navigation", { name: site.navLabel });
    for (const s of home.sections) {
      expect(screen.getByRole("link", { name: s.label })).toHaveAttribute("href", `#${s.id}`);
    }
    expect(nav).not.toContainElement(screen.getByRole("link", { name: site.cta.label }));
  });
});
