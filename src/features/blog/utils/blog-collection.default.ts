import { getCollection } from "astro:content";

export const defaultBlogCollection = (
  await getCollection("blog", (entry) => {
    if (import.meta.env.DEV) return true;
    if (entry.data.draft) return false;
    if (entry.data.publishedAt.getTime() > Date.now()) return false;
    return true;
  })
).sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
