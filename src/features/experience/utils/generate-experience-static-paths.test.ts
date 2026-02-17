import { describe, it, expect } from "vitest";
import { generateExperienceStaticPaths } from "./generate-experience-static-paths";
import { LOCALES, C } from "@/site.config";

describe("generateExperienceStaticPaths", () => {
  it("generates one path per locale", () => {
    const paths = generateExperienceStaticPaths();
    expect(paths).toHaveLength(LOCALES.length);
  });

  it("uses the correct localised segment for each locale", () => {
    const paths = generateExperienceStaticPaths();
    for (const path of paths) {
      const locale = path.props.locale as keyof typeof C.SEGMENT_TRANSLATIONS;
      expect(path.params.experience).toBe(
        C.SEGMENT_TRANSLATIONS[locale].experience,
      );
    }
  });

  it("sets locale param to undefined for the default locale (en)", () => {
    const paths = generateExperienceStaticPaths();
    const enPath = paths.find((p) => p.props.locale === "en");
    expect(enPath?.params.locale).toBeUndefined();
  });

  it("sets locale param to 'sv' for the swedish locale", () => {
    const paths = generateExperienceStaticPaths();
    const svPath = paths.find((p) => p.props.locale === "sv");
    expect(svPath?.params.locale).toBe("sv");
  });

  it("includes translation paths for all locales", () => {
    const paths = generateExperienceStaticPaths();
    for (const path of paths) {
      expect(Object.keys(path.props.translations)).toEqual(
        expect.arrayContaining([...LOCALES]),
      );
    }
  });

  it("builds the english translation path without a locale prefix", () => {
    const paths = generateExperienceStaticPaths();
    for (const path of paths) {
      expect(path.props.translations["en"]).toBe(
        `/${C.SEGMENT_TRANSLATIONS.en.experience}`,
      );
    }
  });

  it("builds the swedish translation path with a locale prefix", () => {
    const paths = generateExperienceStaticPaths();
    for (const path of paths) {
      expect(path.props.translations["sv"]).toBe(
        `/sv/${C.SEGMENT_TRANSLATIONS.sv.experience}`,
      );
    }
  });
});
