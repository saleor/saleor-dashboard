import dotenv from "dotenv";

import { defineConfig, devices } from "@playwright/test";

dotenv.config();

export default defineConfig({
  testDir: "playwright/tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // TODO hardcoded values should be extracted to ENVs
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 2,
  reporter: process.env.CI ? "blob" : "html",
  timeout: 60000 ,
  expect: { timeout: 10000 },
  // webServer: {
  //   command: "npm run dev",
  //   url: "http://localhost:9000/",
  //   reuseExistingServer: !process.env.CI,
  // },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: process.env.BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    testIdAttribute: "data-test-id",
    video: process.env.CI ? "retain-on-failure" : "off",
  },

  /* Configure projects for major browsers */
  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/ },

    {
      // if new project added make sure to add dependency as below
      dependencies: ["setup"],
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
