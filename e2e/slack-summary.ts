#!/usr/bin/env node

/**
 * Turns the nightly run's Playwright json reports into the body of its Slack message.
 *
 *   node e2e/slack-summary.ts <reports-dir>
 *
 * `<reports-dir>` holds one downloaded `e2e-<target>-report--attempt-<n>` artifact per
 * target. The body is written to `$GITHUB_OUTPUT` as `body`, or printed without it.
 *
 * Executed directly by Node's TypeScript type stripping (Node >= 24).
 */
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import type { JSONReport, JSONReportSpec, JSONReportSuite } from "@playwright/test/reporter";

/* A Slack text block holds 3000 characters; the run link covers the rest. */
const LIMIT = 15;
const ARTIFACT = /^e2e-(.+)-report--attempt-\d+$/;

const escapeMrkdwn = (text: string): string =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const specsOf = (suite: JSONReportSuite): JSONReportSpec[] => [
  ...suite.specs,
  ...(suite.suites ?? []).flatMap(specsOf),
];

const summarizeTarget = (target: string, artifactDir: string): string[] => {
  const reportPath = path.join(artifactDir, "e2e/test-results/results.json");

  // The artifact is uploaded even when the run failed before Playwright started.
  if (!fs.existsSync(reportPath)) {
    return [`*${target}*: failed before any test ran`];
  }

  const report: JSONReport = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  const failed = report.suites
    .flatMap(specsOf)
    .filter(spec => spec.tests.some(test => test.status === "unexpected"))
    .map(spec => `• \`${spec.file}:${spec.line}\` ${escapeMrkdwn(spec.title)}`);

  if (failed.length === 0) {
    return [];
  }

  return [
    `*${target}*: ${failed.length} failed`,
    ...failed.slice(0, LIMIT),
    ...(failed.length > LIMIT ? [`…and ${failed.length - LIMIT} more`] : []),
  ];
};

const [reportsDir] = process.argv.slice(2);

if (!reportsDir) {
  console.error("Usage: node e2e/slack-summary.ts <reports-dir>");
  process.exit(1);
}

// A target that was not run has no artifact, so it is not listed at all.
const lines = (fs.existsSync(reportsDir) ? fs.readdirSync(reportsDir) : []).sort().flatMap(name => {
  const target = ARTIFACT.exec(name)?.[1];

  return target ? summarizeTarget(target, path.join(reportsDir, name)) : [];
});

const body = lines.length ? lines.join("\n") : "No test failures recorded - see the run logs";

if (process.env.GITHUB_OUTPUT) {
  const delimiter = `EOF_${randomUUID()}`;

  fs.appendFileSync(process.env.GITHUB_OUTPUT, `body<<${delimiter}\n${body}\n${delimiter}\n`);
} else {
  console.log(body);
}
