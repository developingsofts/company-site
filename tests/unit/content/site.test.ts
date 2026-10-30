import { describe, expect, it } from "vitest";
import { site } from "@/content/site";

describe("site content", () => {
  it("keeps the name out of all caps", () => {
    expect(site.name).not.toBe(site.name.toUpperCase());
  });

  it("has a mailable contact address", () => {
    expect(site.email).toMatch(/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i);
  });

  it("points the call to action at an in-page anchor", () => {
    expect(site.cta.href).toMatch(/^#[a-z][\w-]*$/);
  });
});
