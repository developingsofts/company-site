import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import { site } from "@/content/site";

describe("HomePage", () => {
  it("renders the tagline as the only h1", () => {
    render(<HomePage />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(site.tagline);
  });

  it("keeps header and footer outside the reveal container", () => {
    const { container } = render(<HomePage />);
    const main = container.querySelector("main");
    expect(main).toHaveClass("reveal-landing");
    expect(main?.querySelector("header, footer")).toBeNull();
    expect(main?.firstElementChild).toContainElement(screen.getByRole("heading", { level: 1 }));
  });
});
