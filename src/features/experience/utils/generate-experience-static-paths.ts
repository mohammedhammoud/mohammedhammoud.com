import { C } from "@/site.config";
import { toLocale } from "@i18n/to-locale";
import { LOCALE_PARAM_MAP } from "@shared/utils/locale-param-map";

export function generateExperienceStaticPaths() {
  return Object.entries(LOCALE_PARAM_MAP).map(([propsLocale, paramsLocale]) => {
    const locale = toLocale(propsLocale);
    const segment = C.SEGMENT_TRANSLATIONS[locale].experience;

    const translations: Record<string, string> = Object.fromEntries(
      Object.entries(LOCALE_PARAM_MAP).map(([translationLocale, slug]) => {
        const localeSegment =
          C.SEGMENT_TRANSLATIONS[toLocale(translationLocale)].experience;
        const path = slug ? `/${slug}/${localeSegment}` : `/${localeSegment}`;
        return [translationLocale, path];
      }),
    );

    return {
      params: { locale: paramsLocale, experience: segment },
      props: { locale: propsLocale, translations },
    };
  });
}
