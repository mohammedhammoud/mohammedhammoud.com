import { describe, it, expect, vi } from "vitest";

const makePost = (
  id: string,
  locale: string,
  translationId: string,
  tags: string[],
) => ({
  id,
  slug: id,
  data: {
    title: `Post ${id}`,
    description: "desc",
    publishedAt: new Date("2024-01-01"),
    draft: false,
    locale,
    translationId,
    tags,
  },
});

const mockPosts = [
  makePost("en-1", "en", "t-1", ["backend"]),
  makePost("sv-1", "sv", "t-1", ["sv-only"]),
  makePost("en-2", "en", "t-2", ["en-only"]),
];

vi.mock("@/features/blog/utils/blog-collection.default", () => ({
  defaultBlogCollection: mockPosts,
}));

vi.mock("astro-loader-i18n", () => ({
  i18nProps: vi.fn(
    (collection: typeof mockPosts, _opts: unknown) => collection,
  ),
}));

vi.mock("@shared/utils/resolve-path", () => ({
  resolvePath: vi.fn(
    (...parts: Array<string | undefined>) =>
      "/" + parts.filter(Boolean).join("/"),
  ),
}));

vi.mock("limax", () => ({
  default: (str: string) => str.toLowerCase().replace(/\s+/g, "-"),
}));

describe("generateBlogTagPaths", () => {
  it("generates locale-aware tag paths", async () => {
    const { generateBlogTagPaths } = await import("./generate-blog-tag-paths");
    const paths = await generateBlogTagPaths();

    expect(
      paths.some(
        (p) =>
          p.params.locale === undefined &&
          p.params.blog === "blog" &&
          p.params.tag === "en-only",
      ),
    ).toBe(true);

    expect(
      paths.some(
        (p) =>
          p.params.locale === "sv" &&
          p.params.blog === "blogg" &&
          p.params.tag === "sv-only",
      ),
    ).toBe(true);
  });

  it("falls back translation URL to blog index when tag is missing in another locale", async () => {
    const { generateBlogTagPaths } = await import("./generate-blog-tag-paths");
    const paths = await generateBlogTagPaths();
    const svOnlyPath = paths.find(
      (p) => p.params.locale === "sv" && p.params.tag === "sv-only",
    );

    expect(svOnlyPath).toBeDefined();
    expect(svOnlyPath?.props.translations["en"]).toBe("/blog");
    expect(svOnlyPath?.props.translations["sv"]).toBe("/sv/blogg/tag/sv-only");
  });
});
