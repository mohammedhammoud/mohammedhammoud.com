import { i18nPropsAndParams } from "astro-loader-i18n";
import sluggify from "limax";
import { defaultBlogCollection } from "@/features/blog/utils/blog-collection.default";
import { defaultPropsAndParamsOptions } from "@shared/utils/default-props-and-params";
import { resolvePath } from "@shared/utils/resolve-path";
import { LOCALE_PARAM_MAP } from "@shared/utils/locale-param-map";
import { C } from "@/site.config";
import { toLocale } from "@i18n/to-locale";

export async function generateBlogPostPaths() {
  const collection = defaultBlogCollection;
  const routePattern = "[...locale]/[blog]/[...slug]";

  const paths = i18nPropsAndParams(collection, {
    ...defaultPropsAndParamsOptions,
    routePattern,
    generateSegments: (entry) => ({
      slug: sluggify(entry.data.title),
    }),
  });

  return paths.map((path) => {
    const translations: Record<string, string> = {
      ...(path.props?.translations ?? {}),
    };
    for (const [locale, localeParam] of Object.entries(LOCALE_PARAM_MAP)) {
      if (!(locale in translations)) {
        const segment = C.SEGMENT_TRANSLATIONS[toLocale(locale)].blog;
        translations[locale] = resolvePath(localeParam, segment);
      }
    }
    return { ...path, props: { ...path.props, translations } };
  });
}
