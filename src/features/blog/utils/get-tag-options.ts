import sluggify from "limax";
import type { CollectionEntry } from "astro:content";

type BlogCollectionEntry = CollectionEntry<"blog">;

export interface TagOption {
  label: string;
  slug: string;
}

export function getTagOptions(posts: BlogCollectionEntry[]) {
  const tagsBySlug = new Map<string, string>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = sluggify(tag);
      if (!tagsBySlug.has(slug)) {
        tagsBySlug.set(slug, tag);
      }
    }
  }

  return Array.from(tagsBySlug.entries())
    .map(([slug, label]) => ({ slug, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
