import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: ["**/e2e/**/*.spec.ts"],
  use: {
    baseURL: "http://127.0.0.1:4321",
  },
  workers: process.env.CI ? 1 : undefined,
  webServer: {
    command: "yarn preview --host 127.0.0.1 --port 4321",
    url: "http://127.0.0.1:4321",
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});
