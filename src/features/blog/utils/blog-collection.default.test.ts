import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { CollectionEntry } from "astro:content";

vi.mock("astro:content", () => ({
  getCollection: vi.fn(),
}));

const pastDate = new Date("2024-01-01T00:00:00Z");
const futureDate = new Date("2099-01-01T00:00:00Z");

const makeEntry = (
  id: string,
  overrides: Partial<CollectionEntry<"blog">["data"]> = {},
): CollectionEntry<"blog"> =>
  ({
    id,
    collection: "blog",
    data: {
      translationId: id,
      locale: "en",
      contentPath: `${id}.md`,
      basePath: "src/features/blog/posts",
      title: "Test post",
      description: "desc",
      publishedAt: pastDate,
      draft: false,
      ...overrides,
    },
  }) as CollectionEntry<"blog">;

describe("defaultBlogCollection", () => {
  const originalDev = import.meta.env.DEV;

  beforeEach(() => {
    vi.resetModules();
    import.meta.env.DEV = false;
  });

  afterEach(() => {
    import.meta.env.DEV = originalDev;
  });

  it("excludes draft posts in production", async () => {
    const { getCollection } = await import("astro:content");
    const entries = [
      makeEntry("draft-post", { draft: true }),
      makeEntry("published-post"),
    ];
    vi.mocked(getCollection).mockImplementation(
      async (_name: string, filter?: (e: unknown) => boolean) =>
        filter ? entries.filter(filter) : entries,
    );

    const { defaultBlogCollection } = await import("./blog-collection.default");
    expect(defaultBlogCollection).toHaveLength(1);
    expect(defaultBlogCollection[0].id).toBe("published-post");
  });

  it("excludes posts with a future publishedAt date in production", async () => {
    const { getCollection } = await import("astro:content");
    const entries = [
      makeEntry("future-post", { publishedAt: futureDate }),
      makeEntry("past-post"),
    ];
    vi.mocked(getCollection).mockImplementation(
      async (_name: string, filter?: (e: unknown) => boolean) =>
        filter ? entries.filter(filter) : entries,
    );

    const { defaultBlogCollection } = await import("./blog-collection.default");
    expect(defaultBlogCollection).toHaveLength(1);
    expect(defaultBlogCollection[0].id).toBe("past-post");
  });

  it("sorts posts by publishedAt descending", async () => {
    const { getCollection } = await import("astro:content");
    const entries = [
      makeEntry("older", { publishedAt: new Date("2023-01-01") }),
      makeEntry("newest", { publishedAt: new Date("2025-06-01") }),
      makeEntry("middle", { publishedAt: new Date("2024-06-01") }),
    ];
    vi.mocked(getCollection).mockImplementation(
      async (_name: string, filter?: (e: unknown) => boolean) =>
        filter ? entries.filter(filter) : entries,
    );

    const { defaultBlogCollection } = await import("./blog-collection.default");
    expect(defaultBlogCollection.map((e) => e.id)).toEqual([
      "newest",
      "middle",
      "older",
    ]);
  });

  it("excludes both drafts and future posts simultaneously", async () => {
    const { getCollection } = await import("astro:content");
    const entries = [
      makeEntry("draft", { draft: true }),
      makeEntry("future", { publishedAt: futureDate }),
      makeEntry("visible"),
    ];
    vi.mocked(getCollection).mockImplementation(
      async (_name: string, filter?: (e: unknown) => boolean) =>
        filter ? entries.filter(filter) : entries,
    );

    const { defaultBlogCollection } = await import("./blog-collection.default");
    expect(defaultBlogCollection).toHaveLength(1);
    expect(defaultBlogCollection[0].id).toBe("visible");
  });

  it("returns an empty array when the collection is empty", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue([]);

    const { defaultBlogCollection } = await import("./blog-collection.default");
    expect(defaultBlogCollection).toHaveLength(0);
  });

  it("includes drafts and future posts in DEV mode", async () => {
    vi.resetModules();
    import.meta.env.DEV = true;

    const { getCollection } = await import("astro:content");
    const entries = [
      makeEntry("draft", { draft: true }),
      makeEntry("future", { publishedAt: futureDate }),
      makeEntry("visible"),
    ];
    vi.mocked(getCollection).mockImplementation(
      async (_name: string, filter?: (e: unknown) => boolean) =>
        filter ? entries.filter(filter) : entries,
    );

    const { defaultBlogCollection } = await import("./blog-collection.default");
    expect(defaultBlogCollection).toHaveLength(3);
  });
});
