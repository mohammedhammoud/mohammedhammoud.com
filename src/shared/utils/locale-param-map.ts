import { C, LOCALES, type Locale } from "@/site.config";

type LocaleParamMap = Record<Locale, string | undefined>;

export const LOCALE_PARAM_MAP: LocaleParamMap = Object.fromEntries(
  LOCALES.map((locale) => [
    locale,
    locale === C.DEFAULT_LOCALE ? undefined : locale,
  ]),
) as LocaleParamMap;
