import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SectionNav } from "@/features/site";

const sections = [
  { id: "one", label: "One" },
  { id: "two", label: "Two" },
];

function Page() {
  return (
    <>
      <SectionNav sections={sections} label="Sections" />
      {sections.map((s) => (
        <section key={s.id} id={s.id} />
      ))}
    </>
  );
}

describe("SectionNav", () => {
  it("marks the first section as the one being read", () => {
    render(<Page />);
    expect(screen.getByRole("link", { name: "One" })).toHaveAttribute("aria-current", "location");
    expect(screen.getByRole("link", { name: "Two" })).not.toHaveAttribute("aria-current");
  });

  it("moves to a section when its chip is clicked and focuses it", async () => {
    render(<Page />);
    await userEvent.click(screen.getByRole("link", { name: "Two" }));
    expect(screen.getByRole("link", { name: "Two" })).toHaveAttribute("aria-current", "location");
    expect(screen.getByRole("link", { name: "One" })).not.toHaveAttribute("aria-current");
    expect(document.activeElement).toBe(document.getElementById("two"));
  });
});
