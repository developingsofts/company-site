import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { TestimonialsPanel } from "@/features/home";

const { heading, items, previous, next, picker } = home.testimonials;
const count = items.length;

/** The slide on show; the one leaving may linger while it fades, so wait it out. */
async function shown(i: number) {
  const slide = screen.getByRole("group", { name: `${i + 1} of ${count}` });
  await waitFor(() => expect(screen.getAllByRole("figure")).toHaveLength(1));
  return slide;
}

describe("TestimonialsPanel", () => {
  it("is a region named by its heading, holding a carousel", () => {
    render(<TestimonialsPanel />);
    const region = screen.getByRole("region", { name: heading });
    expect(region).toHaveAttribute("id", "clients");
    expect(within(region).getByRole("group", { name: heading })).toHaveAttribute("aria-roledescription", "carousel");
  });

  it("opens on the first testimonial, attributed to its author", async () => {
    render(<TestimonialsPanel />);
    const slide = await shown(0);
    expect(slide).toHaveAttribute("aria-roledescription", "testimonial");
    const figure = within(slide).getByRole("figure");
    expect(figure).toHaveTextContent(items[0].quote);
    expect(figure).toHaveTextContent(items[0].company);
    expect(figure).toHaveTextContent(`${items[0].name} // ${items[0].role}`);
  });

  it("steps forward and back, wrapping at both ends", async () => {
    render(<TestimonialsPanel />);
    await userEvent.click(screen.getByRole("button", { name: previous }));
    expect(within(await shown(count - 1)).getByRole("figure")).toHaveTextContent(items[count - 1].quote);
    await userEvent.click(screen.getByRole("button", { name: next }));
    await shown(0);
    await userEvent.click(screen.getByRole("button", { name: next }));
    expect(within(await shown(1)).getByRole("figure")).toHaveTextContent(items[1].quote);
  });

  it("jumps straight to a testimonial from the picker and marks it current", async () => {
    render(<TestimonialsPanel />);
    const choices = within(screen.getByRole("group", { name: picker })).getAllByRole("button");
    expect(choices.map((b) => b.getAttribute("aria-label"))).toEqual(items.map((t) => t.name));
    expect(choices[0]).toHaveAttribute("aria-current", "true");

    await userEvent.click(choices[3]);
    await shown(3);
    expect(choices[3]).toHaveAttribute("aria-current", "true");
    expect(choices[0]).not.toHaveAttribute("aria-current");
  });

  it("previews the next testimonial and moves on to it when clicked", async () => {
    render(<TestimonialsPanel />);
    const preview = () => screen.getByRole("button", { name: `${next}: ${items[1].name}` });
    expect(preview()).toHaveTextContent(items[1].company);
    await userEvent.click(preview());
    await shown(1);
    expect(await screen.findByRole("button", { name: `${next}: ${items[2].name}` })).toBeInTheDocument();
  });

  it("announces slide changes politely", () => {
    render(<TestimonialsPanel />);
    const live = screen.getByRole("group", { name: `1 of ${count}` }).parentElement;
    expect(live).toHaveAttribute("aria-live", "polite");
  });

  it("invites the reader to get in touch", () => {
    render(<TestimonialsPanel />);
    expect(screen.getByRole("heading", { level: 3, name: home.testimonials.join })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: site.cta.label })).toHaveAttribute("href", site.cta.href);
  });

  it("keeps the drawings out of the accessibility tree", () => {
    const { container } = render(<TestimonialsPanel />);
    for (const svg of container.querySelectorAll("svg")) {
      expect(svg.closest("[aria-hidden='true']")).not.toBeNull();
    }
  });
});
