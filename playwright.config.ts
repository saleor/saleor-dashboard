import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const env = process.env;
const DEFAULT_WORKERS = "2";
const shardNumber = env.SHARD_NUMBER?.match(/^\d*/)?.[0] || "0";

// const DEFAULT_RETRIES = "1";

// FIXME: High timeouts are a temporary solution to handle slower CI environments.
// Local development on high-performance machines is much faster, but shared CI workers
// can be overloaded, causing operations to take longer than expected.
export const SUCCESS_BANNER_TIMEOUT = process.env.CI ? 20000 : 10000;

export default defineConfig({
  testDir: "playwright/tests",
  fullyParallel: true,
  forbidOnly: !!env.CI,
  retries: 0,
  // We are disabling retries for now as it prolongs the test run time
  // as the test will most likely fail again. We can enable it later if needed.
  // retries: parseInt(env.RETRIES || DEFAULT_RETRIES),
  workers: parseInt(env.WORKERS || DEFAULT_WORKERS),

  reporter: process.env.CI
    ? [
        ["blob"],
        ["github"],
        [
          "playwright-ctrf-json-reporter",
          {
            outputFile: `ctrf-report-${shardNumber}.json`, // Optional: Output file name. Defaults to 'ctrf-report.json'.
            minimal: true, // Optional: Generate a minimal report. Defaults to 'false'. Overrides screenshot and testType when set to true
            appName: "Saleor Dashboard", // Optional: Specify the name of the application under test.
            appVersion: env.DASHBOARD_VERSION || "", // Optional: Specify the version of the application under test.
            branchName: env.BRANCH_NAME || "", // Optional: Specify the branch name.
            buildName: "Saleor Dashboard",
            buildNumber: process.env.BUILD_NUMBER || "",
            buildUrl: process.env.BUILD_URL || "",
            testEnvironment: env.SALEOR_CLOUD_SERVICE || "", // Optional: Specify the test environment (e.g. staging, production).
          },
        ],
      ]
    : [["html"], ["list"]],
  expect: { timeout: 10 * 1000 },
  maxFailures: 10,
  timeout: 35 * 1000,
  use: {
    baseURL: env.BASE_URL || "",
    trace: env.CI ? "retain-on-failure" : "on",
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
      testIgnore: "playwright/tests/apps.spec.ts",
    },
    {
      name: "apps-e2e",
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"] },
      testMatch: "playwright/tests/apps.spec.ts",
    },
  ],
});
