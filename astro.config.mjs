import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { C, LOCALES } from "./src/site.config.ts";

// https://astro.build/config
export default defineConfig({
  site: C.SITE.url,
  integrations: [mdx(), sitemap()],
  i18n: {
    locales: LOCALES,
    defaultLocale: C.DEFAULT_LOCALE,
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
