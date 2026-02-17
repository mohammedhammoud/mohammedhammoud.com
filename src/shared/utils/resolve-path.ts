import { resolvePath as i18nResolvePath } from "astro-loader-i18n";

export const resolvePath = (...path: Array<string | number | undefined>) => {
  return i18nResolvePath(import.meta.env.BASE_URL, ...path);
};
