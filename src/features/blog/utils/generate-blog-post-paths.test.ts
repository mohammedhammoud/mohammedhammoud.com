import { describe, it, expect, vi } from "vitest";

const mockPosts = [
  {
    id: "en-1",
    data: { title: "Hello World", locale: "en", publishedAt: new Date() },
  },
  {
    id: "sv-1",
    data: {
      title: "Hello World",
      locale: "sv",
      publishedAt: new Date(),
    },
  },
];

const mockPaths = [
  {
    params: { locale: undefined, blog: "blog", slug: "hello-world" },
    props: { translations: { en: "/blog/hello-world" } },
  },
];

let capturedOptions: Record<string, unknown> = {};

vi.mock("@/features/blog/utils/blog-collection.default", () => ({
  defaultBlogCollection: mockPosts,
}));

vi.mock("astro-loader-i18n", () => ({
  i18nPropsAndParams: vi.fn(
    (_collection: unknown, opts: Record<string, unknown>) => {
      capturedOptions = opts;
      return mockPaths;
    },
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

describe("generateBlogPostPaths", () => {
  it("uses the correct i18n route pattern", async () => {
    const { generateBlogPostPaths } =
      await import("./generate-blog-post-paths");
    await generateBlogPostPaths();
    expect(capturedOptions.routePattern).toBe("[...locale]/[blog]/[...slug]");
  });

  it("sluggifies the post title when generating segments", async () => {
    const { generateBlogPostPaths } =
      await import("./generate-blog-post-paths");
    await generateBlogPostPaths();
    const generateSegments = capturedOptions.generateSegments as (
      entry: (typeof mockPosts)[number],
    ) => { slug: string };
    expect(generateSegments(mockPosts[0])).toEqual({ slug: "hello-world" });
  });

  it("adds fallback blog index URL for locales missing a translation", async () => {
    const { generateBlogPostPaths } =
      await import("./generate-blog-post-paths");
    const paths = await generateBlogPostPaths();
    const path = paths[0];
    expect(path.props.translations["en"]).toBe("/blog/hello-world");
    expect(path.props.translations["sv"]).toBe("/sv/blogg");
  });
});
