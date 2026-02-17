import { describe, it, expect } from "vitest";
import { generateRssPaths } from "./generate-rss-paths";
import { LOCALES, DEFAULT_LOCALE } from "@/site.config";

describe("generateRssPaths", () => {
  it("generates one path per locale", () => {
    const paths = generateRssPaths();
    expect(paths).toHaveLength(LOCALES.length);
  });

  it("sets locale param to undefined for the default locale", () => {
    const paths = generateRssPaths();
    const defaultPath = paths.find((p) => p.props.locale === DEFAULT_LOCALE);
    expect(defaultPath?.params.locale).toBeUndefined();
  });

  it("prefixes non-default locale params with a hyphen", () => {
    const paths = generateRssPaths();
    const nonDefault = paths.filter((p) => p.props.locale !== DEFAULT_LOCALE);
    for (const path of nonDefault) {
      expect(path.params.locale).toBe(`-${path.props.locale}`);
    }
  });

  it("includes all locales as props", () => {
    const paths = generateRssPaths();
    const localesInProps = paths.map((p) => p.props.locale).sort();
    expect(localesInProps).toEqual([...LOCALES].sort());
  });
});
