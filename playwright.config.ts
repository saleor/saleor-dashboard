import dotenv from "dotenv";

import { defineConfig, devices } from "@playwright/test";

dotenv.config();

export default defineConfig({
  testDir: "playwright/tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : 2,
  reporter: process.env.CI ? "blob" : "html",
  maxFailures: 5,
  timeout: process.env.CI ? 45000 : 60000,
  use: {
    baseURL: process.env.BASE_URL,
    trace: process.env.CI ? "on-first-retry" : "off",
    screenshot: "only-on-failure",
    testIdAttribute: "data-test-id",
    video: process.env.CI ? "retain-on-failure" : "off",
    headless: true,
  },
  projects: [
    {
    name: "setup",
    testMatch: /.*\.setup\.ts/
    },
    {
      dependencies: ["setup"],
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});

