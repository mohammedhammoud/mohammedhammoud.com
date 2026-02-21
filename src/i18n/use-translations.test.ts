import { describe, it, expect } from "vitest";
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
});
