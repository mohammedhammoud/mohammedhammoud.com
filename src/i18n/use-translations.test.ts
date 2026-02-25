import { describe, it, expect, vi } from "vitest";

vi.mock("./translations", () => ({
  translations: {
    en: {
      "nav.blog": "Blog",
      "nav.experience": "Experience",
      "404.goHome": "Go to homepage",
      "site.description": "My value: {{value}}",
      "profile.bio": "My value: {{ value }}",
    },
    sv: {
      "nav.blog": "Blogg",
      "nav.experience": "Erfarenhet",
      "404.goHome": "Till startsidan",
      "site.description": "Mitt varde: {{value}}",
      "profile.bio": "Mitt varde: {{ value }}",
    },
  },
}));
import { useTranslations } from "./use-translations";

describe("useTranslations", () => {
  it("returns the english translation for an english key", () => {
    const t = useTranslations("en");
    expect(t("nav.blog")).toBe("Blog");
  });

  it("returns the swedish translation for a swedish key", () => {
    const t = useTranslations("sv");
    expect(t("nav.blog")).toBe("Blogg");
  });

  it("returns the nav.experience key per locale", () => {
    const tEn = useTranslations("en");
    const tSv = useTranslations("sv");
    expect(tEn("nav.experience")).toBe("Experience");
    expect(tSv("nav.experience")).toBe("Erfarenhet");
  });

  it("returns the 404.goHome key per locale", () => {
    const tEn = useTranslations("en");
    const tSv = useTranslations("sv");
    expect(tEn("404.goHome")).toBe("Go to homepage");
    expect(tSv("404.goHome")).toBe("Till startsidan");
  });

  it("interpolates variables without whitespace", () => {
    const t = useTranslations("en");
    expect(t("site.description", { value: 123 })).toBe("My value: 123");
  });

  it("interpolates variables with whitespace", () => {
    const t = useTranslations("sv");
    expect(t("profile.bio", { value: 456 })).toBe("Mitt varde: 456");
  });
});
