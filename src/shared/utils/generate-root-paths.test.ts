import { describe, it, expect, vi } from "vitest";
import { LOCALES } from "@/site.config";

vi.mock("@shared/utils/locale-param-map", () => ({
  LOCALE_PARAM_MAP: { en: undefined, sv: "sv" },
}));

vi.mock("@shared/utils/resolve-path", () => ({
  resolvePath: vi.fn(
    (...parts: Array<string | undefined>) =>
      "/" + parts.filter(Boolean).join("/"),
  ),
}));

describe("generateRootPaths", () => {
  it("generates one path per locale", async () => {
    const { generateRootPaths } = await import("./generate-root-paths");
    const paths = generateRootPaths();
    expect(paths).toHaveLength(LOCALES.length);
  });

  it("sets locale param to undefined for the default locale (en)", async () => {
    const { generateRootPaths } = await import("./generate-root-paths");
    const paths = generateRootPaths();
    const enPath = paths.find((p) => p.props.locale === "en");
    expect(enPath?.params.locale).toBeUndefined();
  });

  it("sets locale param to 'sv' for the swedish locale", async () => {
    const { generateRootPaths } = await import("./generate-root-paths");
    const paths = generateRootPaths();
    const svPath = paths.find((p) => p.props.locale === "sv");
    expect(svPath?.params.locale).toBe("sv");
  });

  it("includes a translations map with an entry for every locale", async () => {
    const { generateRootPaths } = await import("./generate-root-paths");
    const paths = generateRootPaths();
    for (const path of paths) {
      expect(Object.keys(path.props.translations)).toEqual(
        expect.arrayContaining([...LOCALES]),
      );
    }
  });
});
