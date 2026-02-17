import { i18nProps } from "astro-loader-i18n";
import sluggify from "limax";
import { defaultBlogCollection } from "@/features/blog/utils/blog-collection.default";
import { defaultPropsAndParamsOptions } from "@shared/utils/default-props-and-params";
import { resolvePath } from "@shared/utils/resolve-path";
import { LOCALE_PARAM_MAP } from "@shared/utils/locale-param-map";
import { C, DEFAULT_LOCALE } from "@/site.config";
import { toLocale } from "@i18n/to-locale";
import type { CollectionEntry } from "astro:content";

export type BlogCollectionEntry = CollectionEntry<"blog">;

export type BlogPost = BlogCollectionEntry & {
  translatedPath: string;
};

export async function generateBlogIndexPaths() {
  const collection = defaultBlogCollection;
  const routePattern = "[...locale]/[blog]/[...slug]";

  const propsAndParams = i18nProps(collection, {
    ...defaultPropsAndParamsOptions,
    routePattern,
    generateSegments: (entry) => ({ slug: sluggify(entry.data.title) }),
  });

  const enPosts = propsAndParams.filter(
    (post) => post.data.locale === DEFAULT_LOCALE,
  );

  return Object.entries(LOCALE_PARAM_MAP).map(([propsLocale, paramsLocale]) => {
    const localePosts = propsAndParams.filter(
      (post) => post.data.locale === propsLocale,
    );
    const localTranslationIds = new Set(
      localePosts.map((p) => p.data.translationId),
    );
    const fallbackPosts =
      propsLocale === DEFAULT_LOCALE
        ? []
        : enPosts.filter((p) => !localTranslationIds.has(p.data.translationId));

    const allPosts = [...localePosts, ...fallbackPosts].sort(
      (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
    );

    const translations: Record<string, string> = Object.fromEntries(
      Object.entries(LOCALE_PARAM_MAP).map(
        ([translationLocale, localeParam]) => {
          const segment =
            C.SEGMENT_TRANSLATIONS[toLocale(translationLocale)].blog;
          return [translationLocale, resolvePath(localeParam, segment)];
        },
      ),
    );

    return {
      params: { locale: paramsLocale },
      props: { posts: allPosts, locale: propsLocale, translations },
    };
  });
}
