import { defineCollection, z } from "astro:content";
import { i18nLoader, extendI18nLoaderSchema } from "astro-loader-i18n";
import { blogCollectionDefinition } from "@/features/blog/utils/blog-collection.definition";

const pages = defineCollection({
  loader: i18nLoader({
    pattern: "*/content/[^_]*.{md,mdx}",
    base: "./src/features",
  }),
  schema: extendI18nLoaderSchema(
    z.object({
      title: z.string(),
      description: z.string(),
      path: z.string(),
      shouldShowTitle: z.boolean().optional().default(true),
    }),
  ),
});

export const collections = { blog: blogCollectionDefinition, pages };
