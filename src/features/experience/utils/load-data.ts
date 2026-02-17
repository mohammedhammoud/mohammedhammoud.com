import type { Locale } from "@/site.config";
import type { DataType } from "@features/experience/types";

export async function loadData<T>(
  type: DataType,
  locale: Locale,
): Promise<T[]> {
  const module = await import(`../data/${type}.${locale}.json`);
  return module.default as T[];
}
