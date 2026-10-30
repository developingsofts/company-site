import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Arrival, CutReveal } from "@/features/home";

const words = (container: HTMLElement) => [...container.querySelectorAll<HTMLElement>("[data-cut-word]")];

describe("CutReveal", () => {
  it("reads as the plain text, once", () => {
    render(
      <h2>
        <CutReveal>{"Built to last"}</CutReveal>
      </h2>,
    );
    expect(screen.getByRole("heading", { name: "Built to last" })).toBeInTheDocument();
  });

  it("keeps its words below the cut until its page arrives", () => {
    const { container } = render(
      <Arrival>
        <CutReveal>{"Built to last"}</CutReveal>
      </Arrival>,
    );
    const shown = words(container);
    expect(shown).toHaveLength(3);
    for (const word of shown) expect(word.style.transform).toContain("140%");
  });

  it("rises straight away outside a page that waits for arrival", async () => {
    const { container } = render(<CutReveal>{"Built to last"}</CutReveal>);
    await waitFor(() => {
      for (const word of words(container)) expect(word.style.transform).not.toContain("140%");
    });
  });

  it("keeps a line break in the text", () => {
    const { container } = render(<CutReveal>{"And when it goes live?\nIt stays up."}</CutReveal>);
    expect(container.querySelectorAll("[aria-hidden] br")).toHaveLength(1);
  });
});
