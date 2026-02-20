import { expect, test } from "@playwright/test";

const locales = [
  { key: "en", home: "/", experience: "/experience" },
  { key: "sv", home: "/sv", experience: "/sv/erfarenhet" },
] as const;

function escapeForRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

for (const locale of locales) {
  test(`[${locale.key}] navigate to experience from top nav`, async ({
    page,
  }) => {
    await page.goto(locale.home);
    await page.getByTestId("nav-tab-experience").click();

    await expect(page).toHaveURL(
      new RegExp(`${escapeForRegex(locale.experience)}\\/?$`),
    );

    const mainContent = page.getByTestId("main-content");

    await expect(mainContent).toBeVisible();
    expect(await mainContent.textContent()).toBeTruthy();
  });

  test(`[${locale.key}] experience page lists jobs, certificates and awards`, async ({
    page,
  }) => {
    await page.goto(locale.experience);

    const jobsList = page.getByTestId("jobs-list");
    const certificatesList = page.getByTestId("certificates-list");
    const awardsList = page.getByTestId("awards-list");

    await expect(jobsList.locator("h3").first()).toBeVisible();
    await expect(certificatesList.locator("h3").first()).toBeVisible();
    await expect(awardsList.locator("h3").first()).toBeVisible();
  });
}
