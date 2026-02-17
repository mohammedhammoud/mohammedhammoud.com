import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["src/pages/**/*.{astro,mdx,ts,js}"],
  project: ["src/**/*.{astro,ts,js,mjs}"],
  ignoreDependencies: ["sharp", "tailwindcss", "@tailwindcss/typography"],
};

export default config;
