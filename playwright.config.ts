import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const env = process.env;
const DEFAULT_WORKERS = "2";
// const DEFAULT_RETRIES = "1";

export default defineConfig({
  testDir: "playwright/tests",
  fullyParallel: true,
  forbidOnly: !!env.CI,
  retries: 0,
  // We are disabling retries for now as it prolongs the test run time
  // as the test will most likely fail again. We can enable it later if needed.
  // retries: parseInt(env.RETRIES || DEFAULT_RETRIES),
  workers: parseInt(env.WORKERS || DEFAULT_WORKERS),
  reporter: "list",
  expect: { timeout: 10 * 1000 },
  maxFailures: 10,
  timeout: 30 * 1000,
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
