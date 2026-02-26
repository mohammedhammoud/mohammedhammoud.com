import { describe, it, expect } from "vitest";
import { getTagOptions } from "./get-tag-options";
import type { CollectionEntry } from "astro:content";

const makePost = (tags: string[]) =>
  ({
    data: {
      tags,
    },
  }) as CollectionEntry<"blog">;

describe("getTagOptions", () => {
  it("returns unique tags sorted by label", () => {
    const options = getTagOptions([
      makePost(["Docker", "CI"]),
      makePost(["CI", "Astro"]),
    ]);

    expect(options).toEqual([
      { label: "Astro", slug: "astro" },
      { label: "CI", slug: "ci" },
      { label: "Docker", slug: "docker" },
    ]);
  });
});
