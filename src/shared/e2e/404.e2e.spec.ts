import { expect, test } from "@playwright/test";

const locales = [
  { key: "en", missing: "/this-route-does-not-exist" },
  { key: "sv", missing: "/sv/this-route-does-not-exist" },
] as const;

for (const locale of locales) {
  test(`[${locale.key}] 404 page is shown for a missing route`, async ({
    page,
  }) => {
    await page.goto(locale.missing);
    await expect(page.getByTestId("not-found-page")).toBeVisible();
    await expect(page.getByTestId("not-found-heading")).toBeVisible();
  });
}
