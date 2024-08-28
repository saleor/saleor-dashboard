import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const env = process.env;
const DEFAULT_RETRIES = "1";
const DEFAULT_WORKERS = "2";

export default defineConfig({
  testDir: "playwright/tests",
  fullyParallel: true,
  forbidOnly: !!env.CI,
  retries: parseInt(env.RETRIES || DEFAULT_RETRIES),
  workers: parseInt(env.WORKERS || DEFAULT_WORKERS),
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
  expect: { timeout: 5000 },
  maxFailures: 10,
  timeout: 30000,
  use: {
    baseURL: env.BASE_URL || "",
    trace: env.CI ? "on-all-retries" : "on",
    screenshot: "only-on-failure",
    testIdAttribute: "data-test-id",
    video: env.CI ? "retain-on-failure" : "off",
    headless: true,
  },
  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "e2e",
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"] },
      testIgnore: "playwright/tests/apps.spec.ts"
    },
    {
      name: "app-tests",
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"] },
      testMatch: "playwright/tests/apps.spec.ts",
    },
  ],
});
