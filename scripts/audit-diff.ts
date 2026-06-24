#!/usr/bin/env node

/**
 * Compares `pnpm audit --json` results to decide whether a change introduces
 * NEW vulnerabilities, and renders a human-readable report.
 *
 * Why this exists: a plain `pnpm audit` on a PR is red whenever `main` already
 * has a vulnerable (usually transitive) dependency, so every PR looked broken
 * even when it changed nothing security-relevant. This script diffs the PR's
 * advisories against `main`'s and only fails on advisories the PR INTRODUCED.
 *
 * Two modes (both read `pnpm audit --json` output saved to files):
 *
 *   # PR gate - fail only on advisories present in head but not in base
 *   node scripts/audit-diff.ts diff --base main.json --head pr.json
 *
 *   # Nightly report - fail on any advisory at/above the threshold
 *   node scripts/audit-diff.ts report --input main.json
 *
 * Flags:
 *   --level <severity>   minimum severity that fails the run (default: moderate)
 *   --fail-open          on unreadable/invalid input, warn and exit 0 instead
 *                        of failing (used by the PR gate so registry/network
 *                        hiccups don't block unrelated PRs)
 *
 * Executed directly by Node's TypeScript type stripping (Node >= 24).
 */

import fs from "node:fs";

export type Severity = "info" | "low" | "moderate" | "high" | "critical" | "unknown";

/** Ordered from least to most severe; index doubles as the comparable rank. */
const SEVERITY_ORDER: Severity[] = ["info", "low", "moderate", "high", "critical"];

export interface Advisory {
  /** Stable identity used for the set difference (GHSA, falling back to id). */
  key: string;
  ghsa: string | null;
  severity: Severity;
  module: string;
  title: string;
  url: string;
  vulnerableVersions: string;
  patchedVersions: string;
}

interface RawAdvisory {
  id?: number;
  github_advisory_id?: string;
  severity?: string;
  module_name?: string;
  title?: string;
  url?: string;
  vulnerable_versions?: string;
  patched_versions?: string;
}

interface AuditJson {
  advisories?: Record<string, RawAdvisory>;
}

function normalizeSeverity(value: string | undefined): Severity {
  const lower = (value ?? "").toLowerCase();

  return (SEVERITY_ORDER as string[]).includes(lower) ? (lower as Severity) : "unknown";
}

export function severityRank(severity: Severity): number {
  const index = SEVERITY_ORDER.indexOf(severity);

  // "unknown" sorts above everything so it is never silently ignored by a gate.
  return index === -1 ? SEVERITY_ORDER.length : index;
}

export function meetsThreshold(severity: Severity, minimum: Severity): boolean {
  return severityRank(severity) >= severityRank(minimum);
}

/**
 * Parses `pnpm audit --json` output into a flat list of advisories.
 *
 * Throws on invalid JSON or a missing `advisories` object so callers can decide
 * whether to fail open or closed. An empty `advisories` object (no vulns) is
 * valid and yields an empty list.
 */
export function parseAudit(content: string): Advisory[] {
  const data: AuditJson = JSON.parse(content);

  if (typeof data !== "object" || data === null || typeof data.advisories !== "object") {
    throw new Error("audit JSON is missing the `advisories` object");
  }

  return Object.entries(data.advisories ?? {}).map(([id, raw]) => {
    const ghsa = raw.github_advisory_id ?? null;

    return {
      key: ghsa ?? String(raw.id ?? id),
      ghsa,
      severity: normalizeSeverity(raw.severity),
      module: raw.module_name ?? "unknown",
      title: raw.title ?? "",
      url: raw.url ?? "",
      vulnerableVersions: raw.vulnerable_versions ?? "",
      patchedVersions: raw.patched_versions ?? "",
    };
  });
}

/** Advisories present in `head` whose key is absent from `base`. */
export function diffIntroduced(head: Advisory[], base: Advisory[]): Advisory[] {
  const baseKeys = new Set(base.map(advisory => advisory.key));

  return head.filter(advisory => !baseKeys.has(advisory.key));
}

export function filterBySeverity(advisories: Advisory[], minimum: Severity): Advisory[] {
  return advisories.filter(advisory => meetsThreshold(advisory.severity, minimum));
}

/** Sorts critical-first so the most urgent rows are read first. */
export function sortBySeverity(advisories: Advisory[]): Advisory[] {
  return [...advisories].sort((a, b) => {
    const bySeverity = severityRank(b.severity) - severityRank(a.severity);

    return bySeverity !== 0 ? bySeverity : a.module.localeCompare(b.module);
  });
}

function countsBySeverity(advisories: Advisory[]): string {
  const counts = new Map<Severity, number>();

  for (const advisory of advisories) {
    counts.set(advisory.severity, (counts.get(advisory.severity) ?? 0) + 1);
  }

  return [...SEVERITY_ORDER]
    .reverse()
    .concat("unknown")
    .filter(severity => (counts.get(severity) ?? 0) > 0)
    .map(severity => `${counts.get(severity)} ${severity}`)
    .join(", ");
}

function advisoryLink(advisory: Advisory): string {
  if (advisory.ghsa && advisory.url) {
    return `[${advisory.ghsa}](${advisory.url})`;
  }

  return advisory.ghsa ?? advisory.url ?? "—";
}

/** Renders advisories as a GitHub-flavored markdown table, critical-first. */
export function renderTable(advisories: Advisory[]): string {
  if (advisories.length === 0) {
    return "";
  }

  const header = "| Severity | Package | Advisory | Title | Vulnerable | Fixed in |";
  const divider = "| --- | --- | --- | --- | --- | --- |";
  const rows = sortBySeverity(advisories).map(advisory =>
    [
      advisory.severity,
      `\`${advisory.module}\``,
      advisoryLink(advisory),
      advisory.title.replace(/\|/g, "\\|"),
      `\`${advisory.vulnerableVersions || "—"}\``,
      `\`${advisory.patchedVersions || "—"}\``,
    ].join(" | "),
  );

  return [header, divider, ...rows.map(row => `| ${row} |`)].join("\n");
}

/** Appends markdown to the GitHub step summary, falling back to stdout. */
function writeSummary(markdown: string): void {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;

  if (summaryPath) {
    fs.appendFileSync(summaryPath, `${markdown}\n`);
  }

  console.log(markdown);
}

/** Appends a `name=value` pair to the GitHub Actions step output, if running in CI. */
function writeOutput(name: string, value: string): void {
  const outputPath = process.env.GITHUB_OUTPUT;

  if (outputPath) {
    fs.appendFileSync(outputPath, `${name}=${value}\n`);
  }
}

function readArg(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);

  return index !== -1 ? args[index + 1] : undefined;
}

function runDiff(args: string[], minimum: Severity, failOpen: boolean): number {
  const basePath = readArg(args, "--base");
  const headPath = readArg(args, "--head");

  if (!basePath || !headPath) {
    throw new Error("`diff` requires --base <file> and --head <file>");
  }

  const commentFile = readArg(args, "--comment-file");

  let base: Advisory[];
  let head: Advisory[];

  try {
    base = parseAudit(fs.readFileSync(basePath, "utf8"));
    head = parseAudit(fs.readFileSync(headPath, "utf8"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (failOpen) {
      writeSummary(
        `### ⚠️ Dependency audit skipped\n\nCould not run the audit diff (${message}). ` +
          `Not blocking this PR; the nightly audit will re-check \`main\`.`,
      );
      writeOutput("introduced", "false");

      return 0;
    }

    throw error;
  }

  const introduced = filterBySeverity(diffIntroduced(head, base), minimum);

  writeOutput("introduced", introduced.length > 0 ? "true" : "false");

  if (introduced.length === 0) {
    writeSummary(
      `### ✅ Dependency audit\n\nThis PR introduces no new ${minimum}+ vulnerabilities.`,
    );

    return 0;
  }

  const report =
    `### ❌ Dependency audit: new vulnerabilities introduced\n\n` +
    `This PR adds **${introduced.length}** ${minimum}+ advisory(ies) not present on \`main\` ` +
    `(${countsBySeverity(introduced)}).\n\n${renderTable(introduced)}`;

  writeSummary(report);

  if (commentFile) {
    fs.writeFileSync(commentFile, `${report}\n`);
  }

  return 1;
}

function runReport(args: string[], minimum: Severity, failOpen: boolean): number {
  const inputPath = readArg(args, "--input");

  if (!inputPath) {
    throw new Error("`report` requires --input <file>");
  }

  let advisories: Advisory[];

  try {
    advisories = parseAudit(fs.readFileSync(inputPath, "utf8"));
  } catch (error) {
    if (failOpen) {
      const message = error instanceof Error ? error.message : String(error);

      writeSummary(`### ⚠️ Dependency audit skipped\n\nCould not run the audit (${message}).`);

      return 0;
    }

    throw error;
  }

  const relevant = filterBySeverity(advisories, minimum);

  if (relevant.length === 0) {
    writeSummary(`### ✅ Dependency audit\n\nNo ${minimum}+ vulnerabilities on \`main\`. 🎉`);

    return 0;
  }

  writeSummary(
    `### ❌ Dependency audit: \`main\` has known vulnerabilities\n\n` +
      `**${relevant.length}** ${minimum}+ advisory(ies) (${countsBySeverity(relevant)}).\n\n` +
      `${renderTable(relevant)}`,
  );

  return 1;
}

function main(): void {
  const [command, ...args] = process.argv.slice(2);
  const minimum = normalizeSeverity(readArg(args, "--level") ?? "moderate");
  const failOpen = args.includes("--fail-open");

  let exitCode: number;

  switch (command) {
    case "diff":
      exitCode = runDiff(args, minimum, failOpen);
      break;
    case "report":
      exitCode = runReport(args, minimum, failOpen);
      break;
    default:
      console.error("Usage: audit-diff.ts <diff|report> [options]");
      exitCode = 2;
  }

  process.exit(exitCode);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
