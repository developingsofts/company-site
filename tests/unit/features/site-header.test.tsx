import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { SiteHeader } from "@/features/site";

describe("SiteHeader", () => {
  it("links the site name home", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: site.name })).toHaveAttribute("href", "/");
  });
});
