import { expect, test } from "@playwright/test";
import * as OTPAuth from "otpauth";

const SELLER_EMAIL = "seller-e2e@artisanat-marketplace.local";
const SELLER_PASSWORD = "changeme123";

function totpCodeFor(secret: string): string {
  return new OTPAuth.TOTP({
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  }).generate();
}

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/auth/connexion");
  await page.getByLabel("Email").fill(SELLER_EMAIL);
  await page.getByLabel("Mot de passe").fill(SELLER_PASSWORD);
  await page.getByRole("button", { name: "Se connecter" }).click();
}

test("a seller can enable 2FA and must then provide a code to log back in", async ({ page }) => {
  await signIn(page);
  await expect(page).not.toHaveURL(/\/auth\/connexion$/);

  await page.goto("/compte");
  await page.getByRole("button", { name: "Activer la 2FA" }).click();

  const secret = await page.locator("p.font-mono").innerText();
  await page.getByLabel("Code a 6 chiffres").fill(totpCodeFor(secret.trim()));
  await page.getByRole("button", { name: "Confirmer" }).click();

  await expect(page.getByText(/Authentification a deux facteurs activee/i)).toBeVisible();
  await expect(page.locator(".grid.grid-cols-2 > span")).toHaveCount(10);
  await page.getByRole("button", { name: "J'ai enregistre mes codes" }).click();

  await page.getByRole("button", { name: "Deconnexion" }).click();
  await page.goto("/auth/connexion");

  await page.getByLabel("Email").fill(SELLER_EMAIL);
  await page.getByLabel("Mot de passe").fill(SELLER_PASSWORD);
  await page.getByRole("button", { name: "Se connecter" }).click();

  await expect(page.getByLabel("Code de verification")).toBeVisible();
  await page.getByLabel("Code de verification").fill(totpCodeFor(secret.trim()));
  await page.getByRole("button", { name: "Verifier le code" }).click();

  await expect(page).not.toHaveURL(/\/auth\/connexion$/);

  await page.goto("/compte");
  await page.getByLabel("Mot de passe", { exact: true }).fill(SELLER_PASSWORD);
  await page.getByRole("button", { name: "Desactiver la 2FA" }).click();
  await expect(page.getByRole("button", { name: "Activer la 2FA" })).toBeVisible();
});
