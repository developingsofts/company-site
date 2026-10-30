import { describe, expect, it } from "vitest";
import { home } from "@/content/home";

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

describe("home content", () => {
  // Capitals are a styling choice made in one place, not baked into the copy.
  // A lone word in capitals is an acronym (a job title like CEO), not shouting.
  it("keeps every line out of all caps", () => {
    for (const line of strings(home).filter((s) => /\s/.test(s))) expect(line).not.toBe(line.toUpperCase());
  });

  it("gives every service a distinct id and its own words", () => {
    const { items } = home.services;
    expect(items.length).toBeGreaterThan(1);
    expect(new Set(items.map((s) => s.id)).size).toBe(items.length);
    for (const { title, body } of items) expect(title && body).toBeTruthy();
  });

  it("gives every process step a distinct id and its own words", () => {
    const { steps } = home.process;
    expect(new Set(steps.map((s) => s.id)).size).toBe(steps.length);
    for (const { title, body } of steps) expect(title && body).toBeTruthy();
  });

  it("names web and mobile technologies, each once", () => {
    const { groups } = home.technology;
    expect(groups.map((g) => g.id)).toEqual(["web", "mobile"]);
    const items = groups.flatMap((g) => g.items);
    expect(items.length).toBeGreaterThan(groups.length);
    expect(new Set(items).size).toBe(items.length);
  });

  it("gives every testimonial a distinct client and a full attribution", () => {
    const { items } = home.testimonials;
    expect(items.length).toBeGreaterThan(1);
    expect(new Set(items.map((t) => t.id)).size).toBe(items.length);
    expect(new Set(items.map((t) => t.name)).size).toBe(items.length);
    for (const { name, role, company, quote } of items) expect(name && role && company && quote).toBeTruthy();
  });

  it("gives every section a distinct id", () => {
    const ids = home.sections.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
