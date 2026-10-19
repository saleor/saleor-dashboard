import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";

import { repoPath } from "../lib/paths.ts";

const envPath = repoPath(".env");

if (existsSync(envPath)) {
  loadEnvFile(envPath);
}

export default defineConfig({
  testDir: ".",
  testMatch: "*.spec.ts",
  outputDir: "../test-results/live-full-descriptions",
  workers: 1,
  retries: 0,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    viewport: { width: 1440, height: 1000 },
    baseURL: process.env.BASE_URL ?? "http://localhost:9000/",
    testIdAttribute: "data-test-id",
    actionTimeout: 15_000,
    // Login credentials and tokens must not be written to browser traces.
    trace: "off",
    video: "off",
    screenshot: "only-on-failure",
  },
});
