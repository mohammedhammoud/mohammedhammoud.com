import { C, LOCALES } from "@/site.config";
import type { Locale } from "@/site.config";

export function generateRssPaths() {
  const versions = [
    undefined,
    ...LOCALES.filter((l) => l !== C.DEFAULT_LOCALE),
  ];
  return versions.map((l) => ({
    params: { locale: l ? `-${l}` : undefined },
    props: { locale: (l || C.DEFAULT_LOCALE) as Locale },
  }));
}
