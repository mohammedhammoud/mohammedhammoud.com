import { C, type Locale, type TabKey } from "@/site.config";

export function segmentToTab(segment: string, locale: Locale): TabKey {
  const segments = C.SEGMENT_TRANSLATIONS[locale];
  const entry = Object.entries(segments).find(([, value]) => value === segment);
  return (entry?.[0] ?? segment) as TabKey;
}
