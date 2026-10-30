import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { SiteHeader, SiteMenu } from "@/features/site";

function Menu() {
  return (
    <SiteMenu>
      <SiteHeader sections={home.sections} />
    </SiteMenu>
  );
}

describe("SiteMenu", () => {
  it("starts closed, showing only the toggle", () => {
    render(<Menu />);
    expect(screen.getByRole("button", { name: site.menu.open })).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("banner")).toBeNull();
  });

  it("opens the header from the toggle and closes it again", async () => {
    render(<Menu />);
    await userEvent.click(screen.getByRole("button", { name: site.menu.open }));
    const toggle = screen.getByRole("button", { name: site.menu.close });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("navigation", { name: site.navLabel })).toBeInTheDocument();
    expect(document.getElementById(toggle.getAttribute("aria-controls")!)).toContainElement(screen.getByRole("banner"));

    await userEvent.click(toggle);
    await waitFor(() => expect(screen.queryByRole("banner")).toBeNull());
  });

  it("closes on Escape", async () => {
    render(<Menu />);
    await userEvent.click(screen.getByRole("button", { name: site.menu.open }));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("banner")).toBeNull());
    expect(screen.getByRole("button", { name: site.menu.open })).toBeInTheDocument();
  });
});
