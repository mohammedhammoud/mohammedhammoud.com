import { translations, type TranslationKey } from "./translations";
import { DEFAULT_LOCALE, type Locale } from "@/site.config";

type TFunction = (key: TranslationKey) => string;

export function useTranslations(lang: Locale): TFunction {
  return function t(key: TranslationKey) {
    return translations[lang][key] || translations[DEFAULT_LOCALE][key];
  };
}
