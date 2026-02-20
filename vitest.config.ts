import { defineConfig, configDefaults } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@features": resolve(__dirname, "src/features"),
      "@shared": resolve(__dirname, "src/shared"),
      "@i18n": resolve(__dirname, "src/i18n"),
      "@styles": resolve(__dirname, "src/styles"),
    },
  },
  test: {
    globals: true,
    exclude: [...configDefaults.exclude, "**/*.e2e.spec.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/__tests__/**",
        "src/pages/**",
        "src/content.config.ts",
      ],
      reporter: ["text", "html"],
    },
  },
});
