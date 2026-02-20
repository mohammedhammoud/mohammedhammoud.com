import { expect, test } from "@playwright/test";

const locales = [
  { key: "en", home: "/", about: "/about" },
  { key: "sv", home: "/sv", about: "/sv/om" },
] as const;

function escapeForRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

for (const locale of locales) {
  test(`[${locale.key}] navigate to about from top nav`, async ({ page }) => {
    await page.goto(locale.home);
    await page.getByTestId("nav-tab-about").click();
    await expect(page).toHaveURL(
      new RegExp(`${escapeForRegex(locale.about)}\\/?$`),
    );

    const mainContent = page.getByTestId("main-content");
    await expect(mainContent).toBeVisible();
    expect(await mainContent.textContent()).toBeTruthy();
  });
}
