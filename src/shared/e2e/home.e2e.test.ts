import { expect, test } from "@playwright/test";

const locales = [
  { key: "en", home: "/" },
  { key: "sv", home: "/sv" },
] as const;

for (const locale of locales) {
  test(`[${locale.key}] home page loads with profile and nav`, async ({
    page,
  }) => {
    const expectedTabs = ["blog", "experience", "about"];
    await page.goto(locale.home);
    await expect(page.getByTestId("profile-heading")).toBeVisible();
    for (const tab of expectedTabs) {
      await expect(page.getByTestId(`nav-tab-${tab}`)).toBeVisible();
    }
  });
}
