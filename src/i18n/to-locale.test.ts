import { describe, it, expect } from "vitest";
import { toLocale } from "./to-locale";
import { DEFAULT_LOCALE } from "@/site.config";

describe("toLocale", () => {
  it("returns 'en' for 'en'", () => {
    expect(toLocale("en")).toBe("en");
  });

  it("returns 'sv' for 'sv'", () => {
    expect(toLocale("sv")).toBe("sv");
  });

  it("returns the default locale for an unknown string", () => {
    expect(toLocale("fr")).toBe(DEFAULT_LOCALE);
  });

  it("returns the default locale for an empty string", () => {
    expect(toLocale("")).toBe(DEFAULT_LOCALE);
  });

  it("returns the default locale for undefined", () => {
    expect(toLocale(undefined)).toBe(DEFAULT_LOCALE);
  });
});
