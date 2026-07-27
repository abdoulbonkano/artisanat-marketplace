import { expect, test } from "@playwright/test";

test("a visitor can sign up and then log in with the same credentials", async ({ page }) => {
  const email = `e2e-${Date.now()}@artisanat-marketplace.local`;
  const password = "password123";

  await page.goto("/auth/inscription");
  await page.getByLabel("Nom").fill("Client Test");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Mot de passe").fill(password);
  await page.getByRole("button", { name: "Creer mon compte" }).click();

  await expect(page).not.toHaveURL(/\/auth\/inscription$/);

  await page.goto("/auth/connexion");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Mot de passe").fill(password);
  await page.getByRole("button", { name: "Se connecter" }).click();

  await expect(page).not.toHaveURL(/\/auth\/connexion$/);
});

test("logging in with a wrong password shows an error", async ({ page }) => {
  const email = `e2e-wrong-${Date.now()}@artisanat-marketplace.local`;
  const password = "password123";

  await page.goto("/auth/inscription");
  await page.getByLabel("Nom").fill("Client Test");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Mot de passe").fill(password);
  await page.getByRole("button", { name: "Creer mon compte" }).click();
  await expect(page).not.toHaveURL(/\/auth\/inscription$/);

  await page.goto("/auth/connexion");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Mot de passe").fill("wrong-password");
  await page.getByRole("button", { name: "Se connecter" }).click();

  await expect(page.getByText(/identifiants|incorrect|invalide/i)).toBeVisible();
});
