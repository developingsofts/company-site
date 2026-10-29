import { expect, test } from "@playwright/test";

test.describe("home", () => {
  test("renders without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("sets text in Inter", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const family = await page
      .getByRole("heading", { level: 1 })
      .evaluate((el) => getComputedStyle(el).fontFamily);
    expect(family.toLowerCase()).toContain("inter");
  });

  test("has no horizontal page scroll at phone width", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("the hero ends fully visible", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("main > :first-child");
    await expect(hero).toBeVisible();
    await expect
      .poll(() => hero.evaluate((el) => Number(getComputedStyle(el).opacity)))
      .toBe(1);
  });
});
