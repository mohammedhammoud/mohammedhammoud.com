import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import prettier from "eslint-config-prettier";
import unusedImports from "eslint-plugin-unused-imports";
import playwright from "eslint-plugin-playwright";
import vitest from "@vitest/eslint-plugin";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      ".history/",
      "**/build/",
      "**/dist/",
      "**/node_modules/",
      "CHANGELOG.md",
      ".astro/",
    ],
  },
  ...astro.configs.recommended,
  {
    extends: [
      js.configs.recommended,
      { plugins: { "unused-imports": unusedImports } },
      ...tseslint.configs.recommended,
    ],
    files: ["**/*.{ts,mts,cts}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    ...playwright.configs["flat/recommended"],
    files: ["**/*.e2e.spec.ts"],
  },
  {
    plugins: { vitest },
    rules: vitest.configs.recommended.rules,
    files: ["**/*.{test,spec}.ts"],
    ignores: ["**/*.e2e.spec.ts"],
  },
  prettier,
);
