import { i18nProps } from "astro-loader-i18n";
import sluggify from "limax";
import { defaultBlogCollection } from "@/features/blog/utils/blog-collection.default";
import { defaultPropsAndParamsOptions } from "@shared/utils/default-props-and-params";
import { resolvePath } from "@shared/utils/resolve-path";
import { LOCALE_PARAM_MAP } from "@shared/utils/locale-param-map";
import { C, DEFAULT_LOCALE } from "@/site.config";
import { toLocale } from "@i18n/to-locale";
import { getTagOptions } from "@/features/blog/utils/get-tag-options";

export async function generateBlogTagPaths() {
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

  const localePostsByLocale = new Map(
    Object.entries(LOCALE_PARAM_MAP).map(([propsLocale]) => {
      const localePosts = propsAndParams.filter(
        (post) => post.data.locale === propsLocale,
      );
      const localTranslationIds = new Set(
        localePosts.map((p) => p.data.translationId),
      );
      const fallbackPosts =
        propsLocale === DEFAULT_LOCALE
          ? []
          : enPosts.filter(
              (p) => !localTranslationIds.has(p.data.translationId),
            );

      const allPosts = [...localePosts, ...fallbackPosts].sort(
        (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
      );

      return [propsLocale, allPosts];
    }),
  );

  const tagByLocale = new Map(
    Array.from(localePostsByLocale.entries()).map(([locale, localePosts]) => [
      locale,
      new Map(getTagOptions(localePosts).map((tag) => [tag.slug, tag])),
    ]),
  );

  return Object.entries(LOCALE_PARAM_MAP).flatMap(
    ([propsLocale, paramsLocale]) => {
      const localePosts = localePostsByLocale.get(propsLocale) ?? [];
      const localeTags = getTagOptions(localePosts);

      return localeTags.map((tag) => {
        const blogSegment = C.SEGMENT_TRANSLATIONS[toLocale(propsLocale)].blog;
        const posts = localePosts.filter((post) =>
          post.data.tags.some((postTag) => sluggify(postTag) === tag.slug),
        );
        const translations: Record<string, string> = Object.fromEntries(
          Object.entries(LOCALE_PARAM_MAP).map(
            ([translationLocale, translationLocaleParam]) => {
              const translationBlogSegment =
                C.SEGMENT_TRANSLATIONS[toLocale(translationLocale)].blog;
              const translatedTag = tagByLocale
                .get(translationLocale)
                ?.get(tag.slug);

              const translatedPath = translatedTag
                ? resolvePath(
                    translationLocaleParam,
                    translationBlogSegment,
                    "tag",
                    translatedTag.slug,
                  )
                : resolvePath(translationLocaleParam, translationBlogSegment);

              return [translationLocale, translatedPath];
            },
          ),
        );

        return {
          params: { locale: paramsLocale, tag: tag.slug, blog: blogSegment },
          props: {
            locale: propsLocale,
            tag: tag.label,
            tagSlug: tag.slug,
            posts,
            translations,
          },
        };
      });
    },
  );
}
