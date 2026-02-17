import rss from "@astrojs/rss";
import { translations } from "@i18n/translations";
import { C } from "@/site.config";
import { generateRssPaths } from "@shared/utils/generate-rss-paths";
import { getBlogRssItems } from "@/features/blog/utils/get-blog-rss-items";
import type { APIContext } from "astro";
import type { Locale } from "@/site.config";

export async function getStaticPaths() {
  return generateRssPaths();
}

export async function GET(context: APIContext) {
  const locale = context.props.locale as Locale;
  const posts = await getBlogRssItems(locale);
  const t = translations[locale];

  return rss({
    title: C.SITE.name,
    description: t["site.description"],
    site: context.site ?? C.SITE.url,
    items: posts.map((post) => ({
      ...post.data,
      link: post.translatedPath,
    })),
  });
}
