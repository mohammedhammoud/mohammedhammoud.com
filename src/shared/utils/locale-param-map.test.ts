import { describe, it, expect } from "vitest";
import { LOCALE_PARAM_MAP } from "./locale-param-map";
import { LOCALES, DEFAULT_LOCALE } from "@/site.config";

describe("LOCALE_PARAM_MAP", () => {
  it("has an entry for every locale", () => {
    expect(Object.keys(LOCALE_PARAM_MAP)).toEqual(
      expect.arrayContaining([...LOCALES]),
    );
  });

  it("maps the default locale to undefined", () => {
    expect(LOCALE_PARAM_MAP[DEFAULT_LOCALE]).toBeUndefined();
  });

  it("maps non-default locales to their locale string", () => {
    const nonDefault = LOCALES.filter((l) => l !== DEFAULT_LOCALE);
    for (const locale of nonDefault) {
      expect(LOCALE_PARAM_MAP[locale]).toBe(locale);
    }
  });
});
