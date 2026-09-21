import { defineConfig, devices } from "@playwright/test";

import { e2eConfig, PARALLEL_TAG_PATTERN, parallel } from "./config.ts";
import { SCENARIOS } from "./scenarios/registry.ts";

const config = e2eConfig();

/**
 * Phases, sequenced by Playwright's project `dependencies` - the only ordering primitive
 * that spans workers.
 *
 * For each scenario, in registry order:
 *
 *   restore:<scenario>  one restore, alone
 *   parallel:<scenario> every test tagged `parallel("<scenario>")`, all at once
 *
 * then, once every group has finished:
 *
 *   <target>            everything untagged, one test at a time, each from its own reset
 *
 * Groups run one after another rather than interleaved with the serial tests, and that is
 * deliberate: a reset empties the tables for a second or two, so nothing may overlap it.
 * Batching every parallel group ahead of the serial phase also costs the *fewest* restores
 * - one per group, plus one per serial test. Interleaving by declaration order would add a
 * restore at each boundary and buy nothing, since tests are independent by construction.
 *
 * A scenario with no tagged tests still pays for its restore project (a second or two).
 * Whether a group has members is not knowable when this config is read.
 */
const buildProjects = () => {
  const browser = { ...devices["Desktop Chrome"] };
  const projects = [];
  let previous: string[] = [];

  for (const scenario of Object.keys(SCENARIOS)) {
    const restore = `restore:${scenario}`;
    const group = `parallel:${scenario}`;

    projects.push({
      name: restore,
      testDir: "./setup",
      testMatch: /.*\.setup\.ts/,
      dependencies: previous,
      use: { ...browser, scenario },
    });
    projects.push({
      name: group,
      grep: new RegExp(parallel(scenario)),
      fullyParallel: true,
      dependencies: [restore],
      use: { ...browser, scenario },
    });

    previous = [group];
  }

  projects.push({
    name: config.target,
    grepInvert: PARALLEL_TAG_PATTERN,
    /* A reset cannot share a moment with another test. */
    workers: 1,
    dependencies: previous,
    use: browser,
  });

  return projects;
};

export default defineConfig({
  testDir: "./tests",
  /*
   * Set explicitly: left to the default this resolves against the nearest package.json and
   * lands at the repository root, next to the legacy suite's output.
   */
  outputDir: "./test-results",
  globalSetup: "./global-setup.ts",
  /*
   * The ceiling for the whole run; each project takes what it needs from it below. Each
   * parallel test is a browser context, so the useful bound is memory, not cores.
   */
  workers: Number(process.env.E2E_WORKERS) || 4,
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  /*
   * No retries. A per-test reseed means a failure is reproducible on its own, so a retry
   * mostly hides a real defect behind a second attempt.
   */
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  /* The html report is what the CI workflow uploads as an artifact; `github` annotates the run. */
  reporter: process.env.CI
    ? [["github"], ["list"], ["html", { open: "never" }]]
    : [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: config.dashboardUrl,
    testIdAttribute: "data-test-id",
    /*
     * Without this a click on a locator that never matches waits out the whole test budget
     * in silence, which reads exactly like a slow page rather than a wrong selector.
     */
    actionTimeout: 15_000,
    trace: process.env.CI ? "retain-on-failure" : "on",
    screenshot: "only-on-failure",
    video: process.env.CI ? "retain-on-failure" : "off",
  },
  projects: buildProjects(),
});
