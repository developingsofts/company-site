import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import { home } from "@/content/home";
import { site } from "@/content/site";

describe("HomePage", () => {
  it("renders the headline as the only h1", () => {
    render(<HomePage />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(home.hero.headline);
  });

  it("gives every section in the nav a panel, in order", () => {
    const { container } = render(<HomePage />);
    const panels = [...container.querySelectorAll("main section[id]")].map((s) => s.id);
    expect(panels).toEqual(home.sections.map((s) => s.id));
  });

  it("points every in-page link in the open menu at something on the page", async () => {
    const { container } = render(<HomePage />);
    await userEvent.click(screen.getByRole("button", { name: site.menu.open }));
    const anchors = container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
    expect(anchors.length).toBeGreaterThan(0);
    for (const a of anchors) {
      expect(container.querySelector(a.getAttribute("href")!)).not.toBeNull();
    }
  });

  it("keeps the header outside main", async () => {
    const { container } = render(<HomePage />);
    await userEvent.click(screen.getByRole("button", { name: site.menu.open }));
    expect(container.querySelector("header")).not.toBeNull();
    expect(container.querySelector("main header")).toBeNull();
  });
});
