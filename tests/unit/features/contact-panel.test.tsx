import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { ContactPanel } from "@/features/home";

describe("ContactPanel", () => {
  it("is a region named by its heading", () => {
    render(<ContactPanel />);
    expect(screen.getByRole("region", { name: home.contact.heading })).toHaveAttribute("id", "contact");
  });

  it("offers the contact address as a mail link", () => {
    render(<ContactPanel />);
    expect(screen.getByRole("link", { name: site.email })).toHaveAttribute("href", `mailto:${site.email}`);
  });
});
