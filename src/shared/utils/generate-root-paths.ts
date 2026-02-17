import { resolvePath } from "@shared/utils/resolve-path";
import { LOCALE_PARAM_MAP } from "@shared/utils/locale-param-map";

export function generateRootPaths() {
  return Object.entries(LOCALE_PARAM_MAP).map(([propsLocale, paramsLocale]) => {
    const translations = Object.fromEntries(
      Object.entries(LOCALE_PARAM_MAP).map(([locale, slug]) => [
        locale,
        resolvePath(slug),
      ]),
    );
    return {
      params: { locale: paramsLocale },
      props: { locale: propsLocale, translations },
    };
  });
}
