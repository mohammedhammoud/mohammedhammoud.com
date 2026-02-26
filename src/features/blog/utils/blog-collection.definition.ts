import { defineCollection, z } from "astro:content";
import { i18nLoader, extendI18nLoaderSchema } from "astro-loader-i18n";

export const blogCollectionDefinition = defineCollection({
  loader: i18nLoader({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/features/blog/posts",
  }),
  schema: ({ image }) =>
    extendI18nLoaderSchema(
      z.object({
        title: z.string(),
        description: z.string(),
        publishedAt: z.coerce.date(),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().optional().default(false),
        cover: z
          .object({
            src: image(),
            alt: z.string().optional(),
          })
          .optional(),
      }),
    ),
});
