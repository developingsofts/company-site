import { describe, expect, it } from "vitest";
import { site } from "@/content/site";

describe("site content", () => {
  it("has a name, tagline and description", () => {
    expect(site.name).not.toHaveLength(0);
    expect(site.tagline).not.toHaveLength(0);
    expect(site.description).not.toHaveLength(0);
  });

  it("keeps the name out of all caps", () => {
    expect(site.name).not.toBe(site.name.toUpperCase());
  });
});
