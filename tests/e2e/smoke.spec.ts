import { expect, test } from "@playwright/test";

test.describe("public marketing pages", () => {
  const pages = [
    "/",
    "/produits",
    "/artisans",
    "/notre-histoire",
    "/blog",
    "/blog/notre-demarche",
    "/blog/entretien-bijoux-et-ceramiques",
    "/contact",
    "/mentions-legales",
    "/confidentialite",
    "/cgu",
    "/cgv",
  ];

  for (const path of pages) {
    test(`${path} returns 200 and renders a heading`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1").first()).toBeVisible();
    });
  }

  test("unknown route shows the custom 404 page", async ({ page }) => {
    const response = await page.goto("/cette-page-n-existe-pas");
    expect(response?.status()).toBe(404);
  });
});
