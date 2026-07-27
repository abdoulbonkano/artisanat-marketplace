import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // Locally, `dev:test` layers .env.local (real Stripe/Resend/etc. keys for
    // dev convenience) with .env.test (DATABASE_URL override only). In CI
    // there is no .env.local - all env vars come from the workflow itself -
    // so we start the already-built app directly instead.
    command: process.env.CI ? "npm run start" : "npm run dev:test",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
