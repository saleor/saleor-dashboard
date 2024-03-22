import dotenv from "dotenv";
import { defineConfig, devices } from "@playwright/test";

dotenv.config();
const env = process.env;
const DEFAULT_RETRIES = '0';
const DEFAULT_WORKERS = '2';
export default defineConfig({
  testDir: "playwright/tests",
  fullyParallel: true,
  forbidOnly: !!env.CI,
  retries: parseInt(env.RETRIES || DEFAULT_RETRIES),
  workers: parseInt(env.WORKERS || DEFAULT_WORKERS),
  reporter: env.CI ? "blob" : "html",
  maxFailures: 5,
  timeout: env.CI ? 45000 : 60000,
  use: {
    baseURL: env.BASE_URL || '',
    trace: env.CI ? "on-first-retry" : "off",
    screenshot: "only-on-failure",
    testIdAttribute: "data-test-id",
    video: env.CI ? "retain-on-failure" : "off",
    headless: true,
  },
  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/
    },
    {
      name: "chromium",
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
