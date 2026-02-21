import { expect, test } from "@playwright/test";

test("switch from EN home to SV", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("lang-sv").click();
  await expect(page).toHaveURL(/\/sv\/?$/);
  await expect(page.getByTestId("profile-heading")).toBeVisible();
});

test("switch from SV home to EN", async ({ page }) => {
  await page.goto("/sv");
  await page.getByTestId("lang-en").click();
  await expect(page).toHaveURL(/^https?:\/\/[^/]+\/?$/);
  await expect(page.getByTestId("profile-heading")).toBeVisible();
});

test("switch from EN blog to SV blog", async ({ page }) => {
  await page.goto("/blog");
  await page.getByTestId("lang-sv").click();
  await expect(page).toHaveURL(/\/sv\/blogg\/?$/);
  await expect(page.getByTestId("blog-description")).toBeVisible();
});

test("switch from SV experience to EN experience", async ({ page }) => {
  await page.goto("/sv/erfarenhet");
  await page.getByTestId("lang-en").click();
  await expect(page).toHaveURL(/\/experience\/?$/);
  await expect(page.getByTestId("main-content")).toBeVisible();
});
