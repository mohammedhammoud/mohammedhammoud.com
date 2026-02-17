import { i18nProps } from "astro-loader-i18n";
import sluggify from "limax";
import { defaultBlogCollection } from "@/features/blog/utils/blog-collection.default";
import { defaultPropsAndParamsOptions } from "@shared/utils/default-props-and-params";
import { DEFAULT_LOCALE, type Locale } from "@/site.config";

export async function getBlogRssItems(locale: Locale) {
  const collection = defaultBlogCollection;
  const allProps = i18nProps(collection, {
    ...defaultPropsAndParamsOptions,
    routePattern: "[...locale]/[blog]/[...slug]",
    generateSegments: (entry) => ({ slug: sluggify(entry.data.title) }),
  });

  const localePosts = allProps.filter((post) => post.data.locale === locale);

  if (locale === DEFAULT_LOCALE) return localePosts;

  const enPosts = allProps.filter(
    (post) => post.data.locale === DEFAULT_LOCALE,
  );
  const localTranslationIds = new Set(
    localePosts.map((p) => p.data.translationId),
  );
  const fallbackPosts = enPosts.filter(
    (p) => !localTranslationIds.has(p.data.translationId),
  );

  return [...localePosts, ...fallbackPosts].sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
  );
}
