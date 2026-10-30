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
  it("keeps every line out of all caps", () => {
    for (const line of strings(home)) expect(line).not.toBe(line.toUpperCase());
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

  it("gives every section a distinct id", () => {
    const ids = home.sections.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
