import { translations, type TranslationKey } from "./translations";
import { DEFAULT_LOCALE, type Locale } from "@/site.config";

type TranslationValues = Record<string, string | number>;
type TFunction = (key: TranslationKey, values?: TranslationValues) => string;

const PLACEHOLDER_PATTERN = /{{\s*([a-zA-Z0-9_]+)\s*}}/g;

export function useTranslations(lang: Locale): TFunction {
  return function t(key: TranslationKey, values?: TranslationValues) {
    const message =
      translations[lang][key] || translations[DEFAULT_LOCALE][key];

    if (!values) {
      return message;
    }

    return message.replace(PLACEHOLDER_PATTERN, (match, variableName) => {
      const value = values[variableName];
      return value === undefined ? match : String(value);
    });
  };
}
