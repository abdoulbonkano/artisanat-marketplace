import { expect, test } from "@playwright/test";

test("the seeded product appears in the catalog and its detail page loads", async ({ page }) => {
  await page.goto("/produits");
  await expect(page.getByRole("link", { name: /Bague E2E Test/i })).toBeVisible();

  await page.getByRole("link", { name: /Bague E2E Test/i }).click();
  await expect(page).toHaveURL(/\/produits\/bague-e2e-test$/);
  await expect(page.locator("h1")).toContainText("Bague E2E Test");
});

test("search filters the catalog down to the matching product", async ({ page }) => {
  await page.goto("/produits?q=Bague+E2E");
  await expect(page.getByRole("link", { name: /Bague E2E Test/i })).toBeVisible();

  await page.goto("/produits?q=Ceci+Ne+Matche+Rien+Du+Tout");
  await expect(page.getByRole("link", { name: /Bague E2E Test/i })).not.toBeVisible();
});

test("a logged-in buyer can add the seeded product to their cart", async ({ page }) => {
  const email = `e2e-cart-${Date.now()}@artisanat-marketplace.local`;
  const password = "password123";

  await page.goto("/auth/inscription");
  await page.getByLabel("Nom").fill("Client Panier");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Mot de passe").fill(password);
  await page.getByRole("button", { name: "Creer mon compte" }).click();
  await expect(page).not.toHaveURL(/\/auth\/inscription$/);

  await page.goto("/produits/bague-e2e-test");
  await page.getByRole("button", { name: /Ajouter au panier/i }).click();
  // The add-to-cart form submits an async server action without a redirect;
  // wait for the button's pending state ("Ajout...") to clear so the
  // mutation has actually completed before navigating away.
  await expect(page.getByRole("button", { name: "Ajouter au panier" })).toBeEnabled();

  await page.goto("/panier");
  await expect(page.getByText(/Bague E2E Test/i)).toBeVisible();
});
