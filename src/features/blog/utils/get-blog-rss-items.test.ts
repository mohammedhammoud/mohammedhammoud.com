import { describe, it, expect, vi } from "vitest";

const makePost = (id: string, locale: string, translationId: string) => ({
  id,
  slug: id,
  data: {
    title: `Post ${id}`,
    description: "desc",
    publishedAt: new Date("2024-01-01"),
    draft: false,
    locale,
    translationId,
  },
});

const mockPosts = [
  makePost("en-1", "en", "t-1"),
  makePost("en-2", "en", "t-2"),
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

vi.mock("limax", () => ({
  default: (str: string) => str.toLowerCase().replace(/\s+/g, "-"),
}));

describe("getBlogRssItems", () => {
  it("returns only english posts when locale is 'en'", async () => {
    const { getBlogRssItems } = await import("./get-blog-rss-items");
    const items = await getBlogRssItems("en");
    expect(items.every((p) => p.data.locale === "en")).toBe(true);
    expect(items).toHaveLength(2);
  });

  it("returns swedish posts and EN fallbacks for untranslated posts when locale is 'sv'", async () => {
    const { getBlogRssItems } = await import("./get-blog-rss-items");
    const items = await getBlogRssItems("sv");
    expect(items).toHaveLength(2);
    expect(items.some((p) => p.id === "sv-1")).toBe(true);
    expect(items.some((p) => p.id === "en-2")).toBe(true);
    expect(items.some((p) => p.id === "en-1")).toBe(false);
  });
});
