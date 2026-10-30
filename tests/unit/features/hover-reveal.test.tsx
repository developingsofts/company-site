import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { HoverReveal } from "@/features/site";

describe("HoverReveal", () => {
  it("gives its link the plain text as a name, once", () => {
    render(
      <a href="#x">
        <HoverReveal>Get in touch</HoverReveal>
      </a>,
    );
    expect(screen.getByRole("link", { name: "Get in touch" })).toBeInTheDocument();
  });

  it("rolls while its link is hovered and settles when the pointer leaves", async () => {
    const { container } = render(
      <a href="#x" style={{ padding: 20 }}>
        <HoverReveal>Go</HoverReveal>
      </a>,
    );
    const reveal = container.querySelector("[data-hover-reveal]")!;
    expect(reveal).toHaveAttribute("data-hover-reveal", "off");
    await userEvent.hover(screen.getByRole("link"));
    expect(reveal).toHaveAttribute("data-hover-reveal", "on");
    await userEvent.unhover(screen.getByRole("link"));
    expect(reveal).toHaveAttribute("data-hover-reveal", "off");
  });

  it("rolls when its link takes keyboard focus", async () => {
    const { container } = render(
      <a href="#x">
        <HoverReveal>Go</HoverReveal>
      </a>,
    );
    await userEvent.tab();
    expect(container.querySelector("[data-hover-reveal]")).toHaveAttribute("data-hover-reveal", "on");
  });
});
