import { expect, test } from "@playwright/test";

const locales = [
  { key: "en", home: "/", blog: "/blog" },
  { key: "sv", home: "/sv", blog: "/sv/blogg" },
] as const;

function escapeForRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const nonEmptyTextRegex = /.+/;

for (const locale of locales) {
  test(`[${locale.key}] navigate to blog from top nav`, async ({ page }) => {
    await page.goto(locale.home);
    await page.getByTestId("nav-tab-blog").click();

    await expect(page).toHaveURL(
      new RegExp(`${escapeForRegex(locale.blog)}\\/?$`),
    );

    const description = page.getByTestId("blog-description");
    await expect(description).toBeVisible();
    await expect(description).toHaveText(nonEmptyTextRegex);
  });

  test(`[${locale.key}] blog post page renders title and date`, async ({
    page,
  }) => {
    await page.goto(locale.blog);
    await page.getByTestId("blog-post-link").first().click();

    await expect(page).toHaveURL(/\/blog\/.+/);

    const titleElement = page.getByTestId("blog-post-title");
    await expect(titleElement).toBeVisible();
    await expect(titleElement).toHaveText(nonEmptyTextRegex);

    const dateElement = page.getByTestId("blog-post-date");
    await expect(dateElement).toBeVisible();
    await expect(dateElement).toHaveText(nonEmptyTextRegex);

    const contentElement = page.getByTestId("blog-post-content");
    await expect(contentElement).toBeVisible();
    await expect(contentElement).toHaveText(nonEmptyTextRegex);
  });
}
