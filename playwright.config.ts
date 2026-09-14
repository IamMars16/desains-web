import { defineConfig, devices } from "@playwright/test";

/**
 * Local: usa Microsoft Edge instalado (sin descargar navegadores) contra `next start`.
 * Sitio publicado: PLAYWRIGHT_BASE_URL=https://... npm run test:e2e
 */
const external = process.env.PLAYWRIGHT_BASE_URL;
const baseURL = external ?? "http://localhost:3100";
const channel = process.env.PW_CHANNEL ?? (process.platform === "win32" ? "msedge" : undefined);

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 45_000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: { baseURL, trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel, viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel } },
  ],
  webServer: external
    ? undefined
    : { command: "npm run start -- -p 3100", url: baseURL, reuseExistingServer: true, timeout: 120_000 },
});
