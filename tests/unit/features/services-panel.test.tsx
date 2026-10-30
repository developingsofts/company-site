import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { home } from "@/content/home";
import { ServicesPanel } from "@/features/home";

const { heading, items } = home.services;
const trigger = (title: string) => screen.getByRole("button", { name: title });

describe("ServicesPanel", () => {
  it("is a region named by its heading", () => {
    render(<ServicesPanel />);
    expect(screen.getByRole("region", { name: heading })).toHaveAttribute("id", "services");
  });

  it("lists every service as a closed accordion item until it slides in", () => {
    render(<ServicesPanel />);
    for (const { title } of items) expect(trigger(title)).toHaveAttribute("aria-expanded", "false");
  });

  it("opens one service at a time", async () => {
    render(<ServicesPanel />);
    const [first, second] = items;

    await userEvent.click(trigger(first.title));
    expect(trigger(first.title)).toHaveAttribute("aria-expanded", "true");
    const panel = screen.getByRole("region", { name: first.title });
    expect(panel).toHaveTextContent(first.body);
    expect(trigger(first.title)).toHaveAttribute("aria-controls", panel.id);

    await userEvent.click(trigger(second.title));
    expect(trigger(second.title)).toHaveAttribute("aria-expanded", "true");
    expect(trigger(first.title)).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the open service when it is clicked again", async () => {
    render(<ServicesPanel />);
    await userEvent.click(trigger(items[0].title));
    await userEvent.click(trigger(items[0].title));
    expect(trigger(items[0].title)).toHaveAttribute("aria-expanded", "false");
  });

  it("draws a block per service, hidden from assistive tech", () => {
    const { container } = render(<ServicesPanel />);
    const stack = container.querySelector("[data-service-stack]");
    expect(stack).toHaveAttribute("aria-hidden", "true");
    expect(stack!.querySelectorAll("[data-stack-block]")).toHaveLength(items.length);
  });
});
