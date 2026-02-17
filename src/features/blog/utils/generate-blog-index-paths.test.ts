import { describe, it, expect, vi } from "vitest";
import { LOCALES } from "@/site.config";

const makePost = (
  id: string,
  locale: string,
  translationId: string,
  publishedAt = new Date("2024-01-01"),
) => ({
  id,
  slug: id,
  data: {
    title: `Post ${id}`,
    description: "desc",
    publishedAt,
    draft: false,
    locale,
    translationId,
  },
});

const mockPosts = [
  makePost("en-1", "en", "t-1", new Date("2024-03-01")),
  makePost("en-2", "en", "t-2", new Date("2024-02-01")),
  makePost("sv-1", "sv", "t-1"),
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

describe("generateBlogIndexPaths", () => {
  it("generates one path per locale", async () => {
    const { generateBlogIndexPaths } =
      await import("./generate-blog-index-paths");
    const paths = await generateBlogIndexPaths();
    expect(paths).toHaveLength(LOCALES.length);
  });

  it("sets locale param to undefined for the default locale (en)", async () => {
    const { generateBlogIndexPaths } =
      await import("./generate-blog-index-paths");
    const paths = await generateBlogIndexPaths();
    const enPath = paths.find((p) => p.props.locale === "en");
    expect(enPath?.params.locale).toBeUndefined();
  });

  it("sets locale param to 'sv' for the swedish locale", async () => {
    const { generateBlogIndexPaths } =
      await import("./generate-blog-index-paths");
    const paths = await generateBlogIndexPaths();
    const svPath = paths.find((p) => p.props.locale === "sv");
    expect(svPath?.params.locale).toBe("sv");
  });

  it("for default locale, only includes posts for that locale", async () => {
    const { generateBlogIndexPaths } =
      await import("./generate-blog-index-paths");
    const paths = await generateBlogIndexPaths();
    const enPath = paths.find((p) => p.props.locale === "en");
    expect(enPath!.props.posts.every((p) => p.data.locale === "en")).toBe(true);
  });

  it("for non-default locale, includes locale posts and EN fallbacks for untranslated posts", async () => {
    const { generateBlogIndexPaths } =
      await import("./generate-blog-index-paths");
    const paths = await generateBlogIndexPaths();
    const svPath = paths.find((p) => p.props.locale === "sv");
    const posts = svPath!.props.posts;
    expect(posts).toHaveLength(2);
    expect(posts.some((p) => p.id === "sv-1")).toBe(true);
    expect(posts.some((p) => p.id === "en-2")).toBe(true);
    expect(posts.some((p) => p.id === "en-1")).toBe(false);
  });

  it("sorts posts newest-first within each locale", async () => {
    const { generateBlogIndexPaths } =
      await import("./generate-blog-index-paths");
    const paths = await generateBlogIndexPaths();
    const enPath = paths.find((p) => p.props.locale === "en");
    const dates = enPath!.props.posts.map((p) => p.data.publishedAt.valueOf());
    expect(dates).toEqual([...dates].sort((a, b) => b - a));
  });

  it("includes a translations map with blog index URLs for every locale", async () => {
    const { generateBlogIndexPaths } =
      await import("./generate-blog-index-paths");
    const paths = await generateBlogIndexPaths();

    for (const path of paths) {
      expect(Object.keys(path.props.translations)).toEqual(
        expect.arrayContaining([...LOCALES]),
      );
    }

    const enPath = paths.find((p) => p.props.locale === "en");
    expect(enPath!.props.translations["en"]).toBe("/blog");
    expect(enPath!.props.translations["sv"]).toBe("/sv/blogg");
  });
});
