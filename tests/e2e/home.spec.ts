import { type Page, expect, test } from "@playwright/test";

const board = (page: Page) => page.locator("[data-tetris]");
const scrollY = (page: Page) => page.evaluate(() => window.scrollY);
const left = async (page: Page, selector: string) => (await page.locator(selector).boundingBox())!.x;
const top = async (page: Page, selector: string) => (await page.locator(selector).boundingBox())!.y;

async function openMenu(page: Page) {
  await expect(async () => {
    await page.getByRole("button", { name: "Open menu" }).click({ timeout: 1000 });
    await expect(page.locator("header")).toBeVisible({ timeout: 1000 });
  }).toPass();
  // Let it finish sliding in, so positions read off it hold still.
  await expect.poll(async () => (await page.locator("header").boundingBox())?.y).toBe(0);
}

/** The page scroll at which a panel in the chapter has slid all the way in. */
const arrival = (page: Page, id: string) =>
  page.evaluate(
    (id) =>
      document.querySelector("[data-chapter]")!.getBoundingClientRect().top + window.scrollY + document.getElementById(id)!.offsetLeft,
    id,
  );

const travel = (page: Page) =>
  page.evaluate(() => {
    const track = document.querySelector<HTMLElement>("[data-chapter-track]")!;
    return track.scrollWidth - document.documentElement.clientWidth;
  });

/**
 * Loads the page and waits for the chapter to take its scroll length, which it
 * measures once it runs in the browser.
 */
async function visit(page: Page) {
  await page.goto("/");
  const length = await travel(page);
  await expect
    .poll(() => page.evaluate(() => document.querySelector<HTMLElement>("[data-chapter]")!.offsetHeight - innerHeight))
    .toBe(length);
}

/** Scrolls the page and waits for the chapter's track to follow. */
async function scrollPageTo(page: Page, y: number) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
  const expected = Math.min(await page.evaluate(() => window.scrollY), await travel(page));
  await expect
    .poll(() =>
      page.evaluate(() => 0 - new DOMMatrix(getComputedStyle(document.querySelector("[data-chapter-track]")!).transform).m41),
    )
    .toBe(expected);
}

test.describe("home", () => {
  test("renders without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
    page.on("pageerror", (err) => errors.push(err.message));

    await visit(page);
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("Software that ships. Systems that stay up.");
    await page.waitForTimeout(1500);
    expect(errors).toEqual([]);
  });

  test("sets the tagline in Geist Pixel, text in Geist and labels in Geist Mono", async ({ page }) => {
    await visit(page);
    await page.evaluate(() => document.fonts.ready);
    const first = (family: string) => family.split(",")[0].replace(/["']/g, "").trim();
    const family = (locator: ReturnType<Page["locator"]>) => locator.evaluate((el) => getComputedStyle(el).fontFamily);

    expect(first(await family(page.getByRole("heading", { level: 1 })))).toBe("Geist Pixel");
    expect(first(await family(page.locator("#studio p").first()))).toBe("Geist");
    expect(first(await family(page.locator("[data-hero-aside] a")))).toBe("Geist Mono");

    const loaded = await page.evaluate(() =>
      [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/["']/g, "")),
    );
    expect(loaded).toEqual(expect.arrayContaining(["Geist", "Geist Mono", "Geist Pixel"]));
  });

  for (const width of [375, 1440]) {
    test(`the page never scrolls sideways itself, at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 860 });
      await visit(page);
      for (const y of [0, 600, 100_000]) {
        await scrollPageTo(page, y);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow).toBe(0);
      }
    });
  }

  for (const size of [
    { width: 390, height: 844 },
    { width: 1440, height: 900 },
  ]) {
    test(`the game fills the hero under the headline, beside its column, at ${size.width}px`, async ({ page }) => {
      await page.setViewportSize(size);
      await visit(page);
      const hero = (await page.locator("#studio").boundingBox())!;
      const headline = (await page.getByRole("heading", { level: 1 }).boundingBox())!;
      const intro = (await page.locator("#studio p").first().boundingBox())!;
      const field = (await board(page).boundingBox())!;
      const aside = (await page.locator("[data-hero-aside]").boundingBox())!;

      expect(hero.y).toBe(0);
      expect(hero.width).toBe(size.width);
      expect(field.y).toBeGreaterThanOrEqual(Math.max(headline.y + headline.height, intro.y + intro.height));
      expect(field.x).toBe(0);
      // A playable board, not a sliver.
      expect(field.height).toBeGreaterThan(size.height * 0.4);
      expect(aside.y + aside.height).toBeCloseTo(size.height, 0);
      if (size.width < 768) {
        // A phone: the game spans the width with the call to action under it.
        expect(field.width).toBeCloseTo(size.width, 0);
        expect(aside.y).toBeCloseTo(field.y + field.height, 0);
      } else {
        // Wide: the game takes most of the width and the column the rest.
        expect(field.width).toBeGreaterThan(size.width * 0.6);
        expect(field.y + field.height).toBeCloseTo(size.height, 0);
        expect(aside.x).toBeCloseTo(field.x + field.width, 0);
        expect(aside.x + aside.width).toBeCloseTo(size.width, 0);
        // The intro lines up with the column beneath it.
        expect(intro.x).toBeGreaterThanOrEqual(aside.x);
      }
      expect(await left(page, "#approach")).toBeCloseTo(hero.x + hero.width, 0);
    });
  }

  test("the column beside the game fits the screen and leads to contact", async ({ page }) => {
    for (const size of [
      { width: 1440, height: 900 },
      { width: 1280, height: 720 },
      { width: 1024, height: 768 },
    ]) {
      await page.setViewportSize(size);
      await visit(page);
      const aside = page.locator("[data-hero-aside]");
      await expect(aside.getByRole("heading", { level: 3 })).toHaveCount(3);
      const clipped = await aside.evaluate((el) => {
        const box = el.getBoundingClientRect();
        const outside = (n: Element, frame: DOMRect) => {
          const r = n.getBoundingClientRect();
          return r.top < frame.top || r.bottom > frame.bottom;
        };
        const cards = [...el.querySelectorAll(".magic-bento__card")];
        return (
          [...el.querySelectorAll("a")].some((n) => outside(n, box)) ||
          cards.some((card) => outside(card, box)) ||
          cards.some((card) => [...card.querySelectorAll("h3, p")].some((n) => outside(n, card.getBoundingClientRect())))
        );
      });
      expect(clipped).toBe(false);
    }
    await page.locator("[data-hero-aside]").getByRole("link", { name: "Get in touch" }).click();
    await expect(page.locator("#contact")).toBeInViewport({ ratio: 0.5 });
  });

  test("the promise cards rise in, then light up under the pointer", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await visit(page);
    const cells = page.locator("[data-hero-aside] .magic-bento__cell");
    await expect(cells).toHaveCount(3);
    for (const cell of await cells.all()) {
      await expect(cell).toHaveAttribute("data-state", "in");
      await expect.poll(() => cell.evaluate((el) => Number(getComputedStyle(el).opacity))).toBe(1);
    }

    const card = page.locator("[data-hero-aside] .magic-bento__card").first();
    const box = (await card.boundingBox())!;
    const hot = () => card.evaluate((el) => Number(getComputedStyle(el).getPropertyValue("--mb-hot") || 0));
    expect(await hot()).toBe(0);
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 4 });
    await expect(card).toHaveAttribute("data-active", "");
    await expect.poll(hot).toBeGreaterThan(0.5);
  });

  test("a phone keeps the cards out of the strip under the game", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await visit(page);
    await expect(page.locator("[data-hero-aside] .magic-bento")).toBeHidden();
    await expect(page.locator("[data-hero-aside]").getByRole("link", { name: "Get in touch" })).toBeVisible();
  });

  test("scrolling down first slides the chapter sideways, then scrolls the page down", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await visit(page);
    const approachAt = await left(page, "#approach");

    // Inside the chapter: the panels slide left exactly as far as the page
    // scrolled, and nothing moves up.
    await scrollPageTo(page, 400);
    expect(await left(page, "#approach")).toBe(approachAt - 400);
    expect(await top(page, "#studio")).toBe(0);
    expect(await top(page, "#contact")).toBeGreaterThan(900);

    // Past its end: the chapter holds its last position and scrolls away
    // upwards with contact following it.
    await scrollPageTo(page, 100_000);
    await expect(page.locator("#contact")).toBeInViewport();
    expect(await top(page, "#contact")).toBeLessThanOrEqual(0);
    const services = (await page.locator("#services").boundingBox())!;
    expect(services.x + services.width).toBeCloseTo(1440, 0);
  });

  test("the wheel drives the chapter", async ({ page }) => {
    await visit(page);
    const approachAt = await left(page, "#approach");
    await page.mouse.move(400, 400);
    await page.mouse.wheel(0, 500);
    await expect.poll(() => left(page, "#approach")).toBe(approachAt - 500);
  });

  test("End and Home jump to either end of the page", async ({ page }) => {
    await visit(page);
    // Chrome animates key scrolls and drops a key pressed before one settles.
    const settled = page.evaluate(
      () => new Promise((done) => window.addEventListener("scrollend", done, { once: true })),
    );
    await page.keyboard.press("End");
    await settled;
    await expect(page.locator("#contact")).toBeInViewport({ ratio: 0.9 });
    await page.keyboard.press("Home");
    await expect.poll(() => scrollY(page)).toBe(0);
  });

  test("the menu stays folded into its toggle until opened, wherever the page is", async ({ page }) => {
    await visit(page);
    await expect(page.locator("header")).toHaveCount(0);
    await scrollPageTo(page, 100_000);
    const box = (await page.getByRole("button", { name: "Open menu" }).boundingBox())!;
    expect(box.x).toBeLessThan(20);
    expect(box.y).toBeLessThan(20);

    await openMenu(page);
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(page.locator("header")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  });

  for (const line of [
    { name: "the menu's bottom line", scope: "header", open: true },
    { name: "the line under the hero headline", scope: "#studio", open: false },
  ]) {
    test(`${line.name} bends when pulled and springs back`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await visit(page);
      if (line.open) await openMenu(page);
      const strip = page.locator(`${line.scope} [data-elastic-line]`);
      const box = (await strip.boundingBox())!;
      const edge = box.y + box.height / 2;
      const path = strip.locator("path");
      const bend = async () => {
        const d = (await path.getAttribute("d"))!;
        // The control point swings past the strip's top while the line rings.
        const [, mid, , controlY] = d.match(/^M0 ([-\d.e]+)Q([-\d.e]+) ([-\d.e]+)/)!.map(Number);
        return controlY - mid;
      };

      expect(await bend()).toBe(0);
      await page.mouse.move(700, edge - 30);
      await page.mouse.move(700, edge + 1, { steps: 4 });
      await page.mouse.move(700, edge + 18, { steps: 6 });
      await expect.poll(bend).toBeGreaterThan(20);
      await page.mouse.move(700, edge + 200, { steps: 4 });
      await expect.poll(bend, { timeout: 5000 }).toBeCloseTo(0, 0);
    });
  }

  test("link text rolls on hover", async ({ page }) => {
    await visit(page);
    await openMenu(page);
    const cta = page.locator("header").getByRole("link", { name: "Get in touch" });
    const firstLetter = cta.locator("[data-hover-reveal] [aria-hidden] .inline-block .inline-block").first();
    const shift = () => firstLetter.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42);
    expect(await shift()).toBe(0);
    await cta.hover();
    await expect.poll(shift).toBeLessThan(-5);
    await page.mouse.move(700, 600);
    await expect.poll(shift).toBe(0);
  });

  test("the call to action brings the contact section into view", async ({ page }) => {
    await visit(page);
    await expect(page.locator("#contact")).not.toBeInViewport();
    await openMenu(page);
    await page.locator("header").getByRole("link", { name: "Get in touch" }).click();
    await expect(page.locator("#contact")).toBeInViewport({ ratio: 0.5 });
  });

  test("the section nav follows the page and steers it", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await visit(page);
    await openMenu(page);
    const nav = page.getByRole("navigation", { name: "Main" });
    const studio = nav.getByRole("link", { name: "Studio" });
    const approach = nav.getByRole("link", { name: "Approach" });
    const services = nav.getByRole("link", { name: "Services" });
    const contact = nav.getByRole("link", { name: "Contact" });
    await expect(studio).toHaveAttribute("aria-current", "location");

    await page.keyboard.press("End");
    await expect(contact).toHaveAttribute("aria-current", "location");
    await expect(studio).not.toHaveAttribute("aria-current");

    await studio.click();
    await expect.poll(() => scrollY(page)).toBe(0);
    await expect(studio).toHaveAttribute("aria-current", "location");

    await approach.click();
    await expect(page.locator("#approach")).toBeInViewport({ ratio: 0.99 });
    await expect(approach).toHaveAttribute("aria-current", "location");

    await services.click();
    await expect.poll(() => left(page, "#services")).toBeCloseTo(0, 0);
    await expect(services).toHaveAttribute("aria-current", "location");

    await contact.click();
    await expect.poll(() => top(page, "#contact")).toBeLessThanOrEqual(1);
    await expect(contact).toHaveAttribute("aria-current", "location");
  });

  test("the approach panel fits the screen without scrolling it", async ({ page }) => {
    for (const size of [
      { width: 390, height: 844 },
      { width: 1440, height: 900 },
      { width: 1280, height: 720 },
    ]) {
      await page.setViewportSize(size);
      await visit(page);
      const overflow = await page
        .locator("#approach")
        .evaluate((el) => [...el.querySelectorAll("h2, dl, p")].some((n) => n.getBoundingClientRect().bottom > innerHeight));
      expect(overflow).toBe(false);
    }
  });

  test("a small red swarm follows the pointer over the approach text", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await visit(page);
    await scrollPageTo(page, await arrival(page, "approach"));
    const panel = (await page.locator("#approach").boundingBox())!;
    const spot = { x: panel.x + panel.width - 300, y: 450 };
    const clip = { x: spot.x - 150, y: spot.y - 150, width: 300, height: 300 };

    expect(await reddish(page, clip)).toBe(0);
    await page.mouse.move(spot.x - 40, spot.y, { steps: 3 });
    await page.mouse.move(spot.x, spot.y, { steps: 10 });
    await expect.poll(() => reddish(page, clip), { timeout: 5000 }).toBeGreaterThan(50);
  });

  test("the swarm shows nothing while the approach panel slides in", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await visit(page);
    await page.mouse.move(5, 890);
    for (const y of [500, 800, 1000]) {
      await scrollPageTo(page, y);
      const panel = (await page.locator("#approach").boundingBox())!;
      const clip = { x: panel.x, y: 0, width: Math.min(400, 1440 - panel.x), height: 400 };
      expect(await reddish(page, clip)).toBe(0);
    }
  });

  test("the approach text rises only once its panel has slid in", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await visit(page);
    const firstWord = page.locator("#approach h2 [data-cut-word]").first();
    const shift = () => firstWord.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42);

    await page.waitForTimeout(1000);
    expect(await shift()).toBeGreaterThan(50);
    // A sliver in is not arrival.
    await scrollPageTo(page, 300);
    await page.waitForTimeout(500);
    expect(await shift()).toBeGreaterThan(50);

    await scrollPageTo(page, await arrival(page, "approach"));
    await expect.poll(shift).toBe(0);
  });

  test("the falling piece slides and turns without a jump from frame to frame", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await visit(page);
    const frames = await page.evaluate(
      () =>
        new Promise<{ placed: string; x: number; y: number; angle: number }[]>((done) => {
          const out: { placed: string; x: number; y: number; angle: number }[] = [];
          const end = performance.now() + 8000;
          const sample = (now: number) => {
            const svg = document.querySelector("[data-tetris]")!;
            const glide = document.querySelector<SVGGElement>("[data-falling]")!.transform.baseVal.consolidate()?.matrix;
            const place = document.querySelector("[data-falling-piece]")?.getAttribute("transform");
            const m = place?.match(/translate\(([-\d.]+) ([-\d.]+)\) rotate\(([-\d.]+)/);
            if (glide && m) {
              out.push({
                placed: svg.getAttribute("data-placed")!,
                x: glide.e + Number(m[1]),
                y: glide.f + Number(m[2]),
                angle: Number(m[3]),
              });
            }
            if (now < end) requestAnimationFrame(sample);
            else done(out);
          };
          requestAnimationFrame(sample);
        }),
    );
    let moving = 0;
    for (let i = 1; i < frames.length; i++) {
      const [a, b] = [frames[i - 1], frames[i]];
      // A new piece starts somewhere else.
      if (a.placed !== b.placed || b.y < a.y) continue;
      expect(Math.abs(b.x - a.x)).toBeLessThan(0.15);
      expect(b.y - a.y).toBeLessThan(0.15);
      // A quarter turn plays out over many frames, never in one.
      expect(Math.abs(b.angle - a.angle) % 360).toBeLessThan(15);
      if (b.x !== a.x || b.angle !== a.angle) moving++;
    }
    // It did slide or turn in that time.
    expect(moving).toBeGreaterThan(10);
  });

  test("the falling piece glides instead of jumping a cell at a time", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await visit(page);
    const samples = await page.evaluate(
      () =>
        new Promise<number[]>((done) => {
          const out: number[] = [];
          const end = performance.now() + 1500;
          const sample = (now: number) => {
            const falling = document.querySelector<SVGGElement>("[data-falling]")!;
            const t = falling.transform.baseVal.consolidate()?.matrix;
            out.push(t ? t.f : 0);
            if (now < end) requestAnimationFrame(sample);
            else done(out);
          };
          requestAnimationFrame(sample);
        }),
    );
    // Stepped, the piece would sit on whole cells with a zero offset; gliding,
    // it passes through many fractions of a cell.
    const fractions = new Set(samples.filter((y) => y > 0 && y < 1).map((y) => y.toFixed(2)));
    expect(fractions.size).toBeGreaterThan(15);
  });

  test("opens on a low stack and keeps playing", async ({ page }) => {
    await visit(page);
    const { blocks, rows } = await board(page).evaluate((svg) => {
      const [, top, , height] = svg.getAttribute("viewBox")!.split(" ").map(Number);
      const settled = [...svg.querySelectorAll(":scope > rect")].map((r) => Math.floor(Number(r.getAttribute("y"))));
      return { blocks: settled, rows: Math.round(top + height) };
    });
    expect(blocks.length).toBeGreaterThan(4);
    // A row or so: nothing settled above the bottom four rows.
    expect(Math.min(...blocks)).toBeGreaterThanOrEqual(rows - 4);

    const placed = Number(await board(page).getAttribute("data-placed"));
    // A row falls every three quarters of a second, so a piece takes a while.
    await expect
      .poll(async () => Number(await board(page).getAttribute("data-placed")), { timeout: 20_000 })
      .toBeGreaterThan(placed);
  });
});

test.describe("services", () => {
  const expanded = (page: Page, name: string) =>
    expect(page.getByRole("button", { name })).toHaveAttribute("aria-expanded", "true");
  const opacities = (page: Page) =>
    page
      .locator("[data-stack-block]")
      .evaluateAll((blocks) => blocks.map((el) => Math.round(Number(getComputedStyle(el).opacity) * 100) / 100));
  // Pressed where it sits, as a pointer would: a locator click first scrolls
  // its target into view, and for content pinned in the sticky chapter that
  // can scroll the page back to where the chapter starts, which moves the
  // stage on and drops the pick.
  const pick = async (page: Page, name: string) => {
    const box = (await page.getByRole("button", { name }).boundingBox())!;
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  };

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await visit(page);
  });

  test("the panel holds still once it has slid in, while the chapter scrolls on", async ({ page }) => {
    const start = await arrival(page, "services");
    await scrollPageTo(page, start);
    const heading = page.locator("#services-heading");
    const at = (await heading.boundingBox())!.x;
    expect(await left(page, "#services")).toBeCloseTo(0, 0);

    for (const y of [start + 300, start + 900, await travel(page)]) {
      await scrollPageTo(page, y);
      await expect.poll(async () => (await heading.boundingBox())!.x).toBe(at);
    }
  });

  test("scrolling stacks a block per service and opens the one on top", async ({ page }) => {
    await scrollPageTo(page, await arrival(page, "services"));
    await expanded(page, "Agentic AI");
    await expect.poll(async () => (await opacities(page))[0]).toBe(1);

    await scrollPageTo(page, await travel(page));
    await expanded(page, "Infrastructure");
    // The oldest block has sunk away under the three on show.
    await expect.poll(() => opacities(page)).toEqual([0, 1, 1, 1]);
  });

  test("opening a service shows its block alone, until the scroll moves on", async ({ page }) => {
    const end = await travel(page);
    await scrollPageTo(page, end);
    // The stack glides after the scroll; pick once it has caught up.
    await expect.poll(() => opacities(page)).toEqual([0, 1, 1, 1]);
    await pick(page, "Ecommerce");
    await expanded(page, "Ecommerce");
    await expect.poll(() => opacities(page)).toEqual([0, 1, 0, 0]);

    await scrollPageTo(page, end - 400);
    await expanded(page, "Infrastructure");
    await expect.poll(async () => (await opacities(page)).filter((o) => o > 0).length).toBeGreaterThan(1);
  });

  test("opening a service slides the other blocks off instead of dropping them", async ({ page }) => {
    await scrollPageTo(page, await travel(page));
    await expect.poll(() => opacities(page)).toEqual([0, 1, 1, 1]);
    const frames = page.evaluate(
      () =>
        new Promise<{ at: number; opacity: number[] }[]>((done) => {
          const out: { at: number; opacity: number[] }[] = [];
          const end = performance.now() + 1500;
          const sample = (now: number) => {
            out.push({
              at: now,
              opacity: [...document.querySelectorAll<HTMLElement>("[data-stack-block]")].map((el) =>
                Number(getComputedStyle(el).opacity),
              ),
            });
            if (now < end) requestAnimationFrame(sample);
            else done(out);
          };
          requestAnimationFrame(sample);
        }),
    );
    await pick(page, "Ecommerce");
    const seen = await frames;
    // The top block, cleared away, takes a while to fade rather than going
    // in a frame; timed rather than counted, so a slow machine's fewer
    // frames still pass.
    const starts = seen.find((f) => f.opacity[3] < 0.95)!.at;
    const gone = seen.find((f) => f.opacity[3] <= 0.05)!.at;
    expect(gone - starts).toBeGreaterThan(50);
    // The block picked holds solid on its way to the base.
    expect(Math.min(...seen.map((f) => f.opacity[1]))).toBe(1);
  });

  test("the panel fits the screen without scrolling it", async ({ page }) => {
    for (const size of [
      { width: 390, height: 844 },
      { width: 1440, height: 900 },
      { width: 1280, height: 720 },
    ]) {
      await page.setViewportSize(size);
      await visit(page);
      await scrollPageTo(page, await travel(page));
      await expanded(page, "Infrastructure");
      const list = (await page.locator("#services ul").boundingBox())!;
      const heading = (await page.locator("#services-heading").boundingBox())!;
      expect(list.y + list.height).toBeLessThanOrEqual(size.height);
      expect(heading.y + heading.height).toBeLessThanOrEqual(list.y);
    }
  });
});

test.describe("process", () => {
  /** Scrolls so the top of `selector` sits `from` pixels below the top of the screen. */
  const scrollToTop = (page: Page, selector: string, from = 0) =>
    page.evaluate(
      ([selector, from]) => {
        const top = document.querySelector(selector)!.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top - from, behavior: "instant" });
      },
      [selector, from] as const,
    );
  const transformOf = (page: Page, selector: string) =>
    page.locator(selector).first().evaluate((el) => getComputedStyle(el).transform);
  const fanShift = (page: Page) =>
    page.locator("[data-fan='in']").evaluate((el) => new DOMMatrix(getComputedStyle(el.parentElement!).transform).m41);

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await visit(page);
  });

  test("the digits, squares and packets keep flowing while it is on screen", async ({ page }) => {
    await scrollToTop(page, "#process ol", 300);
    for (const selector of ["[data-fan='in'] [data-fan-token]", "[data-fan='out'] [data-fan-token]", "[data-flow-line] span"]) {
      const before = await transformOf(page, selector);
      await expect.poll(() => transformOf(page, selector)).not.toBe(before);
    }
  });

  test("the fans slide in from the sides as the diagram comes up the screen", async ({ page }) => {
    await scrollToTop(page, "#process ol", 860);
    await expect.poll(() => fanShift(page)).toBeLessThan(-10);
    await scrollToTop(page, "#process ol", 300);
    await expect.poll(() => fanShift(page)).toBe(0);
  });

  test("the steps sit side by side, in order, under the heading", async ({ page }) => {
    await scrollToTop(page, "#process");
    const titles = page.locator("#process li h3");
    await expect(titles).toHaveText(["Scoping", "Development", "Delivery", "Training"]);
    const xs = await titles.evaluateAll((els) => els.map((el) => el.getBoundingClientRect().x));
    expect(xs).toEqual([...xs].sort((a, b) => a - b));
    const heading = (await page.locator("#process-heading").boundingBox())!;
    expect((await titles.first().boundingBox())!.y).toBeGreaterThan(heading.y + heading.height);
  });
});

/** Pixels in `clip` with a clear red cast; the approach panel has none but the swarm. */
async function reddish(page: Page, clip: { x: number; y: number; width: number; height: number }) {
  const png = (await page.screenshot({ clip })).toString("base64");
  return page.evaluate(async (png) => {
    const img = new Image();
    img.src = `data:image/png;base64,${png}`;
    await img.decode();
    const canvas = new OffscreenCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(0, 0, img.width, img.height);
    let count = 0;
    for (let i = 0; i < data.length; i += 4) if (data[i] - data[i + 1] > 30) count++;
    return count;
  }, png);
}

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("the board holds still", async ({ page }) => {
    await visit(page);
    const first = await board(page).innerHTML();
    await page.waitForTimeout(1000);
    expect(await board(page).innerHTML()).toBe(first);
  });

  test("the promise cards are simply there, with nothing to wait for", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await visit(page);
    const cells = page.locator("[data-hero-aside] .magic-bento__cell");
    const states = await cells.evaluateAll((els) =>
      els.map((el) => ({ opacity: getComputedStyle(el).opacity, transform: getComputedStyle(el).transform })),
    );
    expect(states).toHaveLength(3);
    for (const s of states) expect(s).toEqual({ opacity: "1", transform: "none" });
  });

  test("the chapter still follows the scroll: it is moved, not animated", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await visit(page);
    const approachAt = await left(page, "#approach");
    await scrollPageTo(page, 300);
    expect(await left(page, "#approach")).toBe(approachAt - 300);
  });

  test("service blocks fade in where they land instead of flying", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await visit(page);
    // A fifth of a screen past arrival, the second block is half way in.
    await scrollPageTo(page, (await arrival(page, "services")) + 1440 * 0.2);
    const second = page.locator('[data-stack-block="1"]');
    await expect.poll(() => second.evaluate((el) => Number(getComputedStyle(el).opacity))).toBeGreaterThan(0);
    expect(await second.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41)).toBe(0);
  });

  test("the process diagram holds its opening frame", async ({ page }) => {
    await visit(page);
    await page.locator("#process ol").scrollIntoViewIfNeeded();
    const token = page.locator("[data-fan='in'] [data-fan-token]").first();
    const first = await token.evaluate((el) => getComputedStyle(el).transform);
    await page.waitForTimeout(600);
    expect(await token.evaluate((el) => getComputedStyle(el).transform)).toBe(first);
  });

  test("the approach text is simply there, with no rise to wait for", async ({ page }) => {
    await visit(page);
    const shifts = await page
      .locator("#approach [data-cut-word]")
      .evaluateAll((words) => words.map((el) => new DOMMatrix(getComputedStyle(el).transform).m42));
    expect(shifts.length).toBeGreaterThan(20);
    expect(shifts.every((y) => y === 0)).toBe(true);
  });
});
