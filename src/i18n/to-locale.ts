import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/site.config";

function isLocale(value?: string): value is Locale {
  return value !== undefined && LOCALES.some((locale) => locale === value);
}

export function toLocale(value?: string): Locale {
  if (isLocale(value)) return value;
  return DEFAULT_LOCALE;
}
