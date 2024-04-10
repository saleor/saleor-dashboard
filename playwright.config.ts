import dotenv from "dotenv";

import { defineConfig, devices } from "@playwright/test";

dotenv.config();

export default defineConfig({
  testDir: "playwright/tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 2,
  reporter: process.env.CI
    ? [
        ["blob"],
        ["github"],
        [
          "playwright-testmo-reporter",
          {
            outputFile: "testmo/testmo.xml", // Optional: Output file path. Defaults to 'testmo.xml'.
            embedBrowserType: true, // Optional: Embed browser type in the XML file. Defaults to false.
            embedTestSteps: true, // Optional: Embed test steps in the XML file. Defaults to true.
            testStepCategories: ["hook", "expect", "pw:api", "test.step"], // Optional: Test step categories to include in the XML file. Defaults to ["hook","expect","pw:api","test.step"]. Possible options are "hook", "expect", "pw:api", "test.step".
            testTitleDepth: 1, // Optional: Test case title depth to report in the XML file. Defaults to 1. Increase this to 2 include suite name. Increase this even further to include the path.
            attachmentBasePathCallback: () =>
              process.env.URL_TO_RUN ? process.env.URL_TO_RUN : "",
          },
        ],
      ]
    : [["html"], ["list"]],
  timeout: 60000,
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
