import assert from "node:assert";

import {
  type Advisory,
  diffIntroduced,
  filterBySeverity,
  meetsThreshold,
  parseAudit,
  renderTable,
  severityRank,
  sortBySeverity,
} from "./audit-diff.ts";

// Arrange / Act / Assert

// Builds a minimal `pnpm audit --json` payload for the given advisories.
function auditJson(advisories: Array<Partial<Record<string, unknown>> & { id: number }>): string {
  const map: Record<string, unknown> = {};

  for (const advisory of advisories) {
    map[String(advisory.id)] = advisory;
  }

  return JSON.stringify({ advisories: map });
}

// parseAudit keys advisories on the GHSA id when present
{
  const advisories = parseAudit(
    auditJson([
      {
        id: 1115393,
        github_advisory_id: "GHSA-v3rj-xjv7-4jmq",
        severity: "moderate",
        module_name: "smol-toml",
        title: "DoS via TOML",
        url: "https://github.com/advisories/GHSA-v3rj-xjv7-4jmq",
        vulnerable_versions: "<1.6.1",
        patched_versions: ">=1.6.1",
      },
    ]),
  );

  assert.strictEqual(advisories.length, 1);
  assert.strictEqual(advisories[0].key, "GHSA-v3rj-xjv7-4jmq");
  assert.strictEqual(advisories[0].severity, "moderate");
  assert.strictEqual(advisories[0].module, "smol-toml");
}

// parseAudit falls back to the numeric id when GHSA is missing
{
  const advisories = parseAudit(auditJson([{ id: 42, severity: "high", module_name: "foo" }]));

  assert.strictEqual(advisories[0].key, "42");
  assert.strictEqual(advisories[0].ghsa, null);
}

// parseAudit treats an empty advisories object (no vulns) as an empty list
{
  assert.deepStrictEqual(parseAudit(JSON.stringify({ advisories: {} })), []);
}

// parseAudit throws on JSON missing the advisories object (so callers can fail open/closed)
{
  assert.throws(() => parseAudit(JSON.stringify({ metadata: {} })));
  assert.throws(() => parseAudit("not json"));
}

// severityRank orders info < low < moderate < high < critical, unknown highest
{
  assert.ok(severityRank("low") < severityRank("moderate"));
  assert.ok(severityRank("moderate") < severityRank("high"));
  assert.ok(severityRank("high") < severityRank("critical"));
  assert.ok(severityRank("unknown") > severityRank("critical"));
}

// meetsThreshold is inclusive of the threshold and excludes lower severities
{
  assert.strictEqual(meetsThreshold("moderate", "moderate"), true);
  assert.strictEqual(meetsThreshold("high", "moderate"), true);
  assert.strictEqual(meetsThreshold("low", "moderate"), false);
  assert.strictEqual(meetsThreshold("info", "moderate"), false);
}

// diffIntroduced returns only advisories present in head but not in base
{
  const base = parseAudit(auditJson([{ id: 1, github_advisory_id: "GHSA-aaa", severity: "high" }]));
  const head = parseAudit(
    auditJson([
      { id: 1, github_advisory_id: "GHSA-aaa", severity: "high" }, // pre-existing on main
      { id: 2, github_advisory_id: "GHSA-bbb", severity: "critical" }, // introduced by PR
    ]),
  );

  const introduced = diffIntroduced(head, base);

  assert.strictEqual(introduced.length, 1);
  assert.strictEqual(introduced[0].key, "GHSA-bbb");
}

// diffIntroduced ignores advisories removed by the PR and pre-existing ones
{
  const base = parseAudit(
    auditJson([
      { id: 1, github_advisory_id: "GHSA-aaa", severity: "high" },
      { id: 2, github_advisory_id: "GHSA-bbb", severity: "moderate" },
    ]),
  );
  const head = parseAudit(auditJson([{ id: 1, github_advisory_id: "GHSA-aaa", severity: "high" }]));

  // Act / Assert: nothing introduced even though head differs from base
  assert.deepStrictEqual(diffIntroduced(head, base), []);
}

// filterBySeverity drops advisories below the threshold
{
  const advisories = parseAudit(
    auditJson([
      { id: 1, github_advisory_id: "GHSA-low", severity: "low" },
      { id: 2, github_advisory_id: "GHSA-mod", severity: "moderate" },
      { id: 3, github_advisory_id: "GHSA-crit", severity: "critical" },
    ]),
  );

  const filtered = filterBySeverity(advisories, "moderate");

  assert.deepStrictEqual(filtered.map(a => a.key).sort(), ["GHSA-crit", "GHSA-mod"]);
}

// sortBySeverity puts critical first, then breaks ties by module name
{
  const advisories: Advisory[] = parseAudit(
    auditJson([
      { id: 1, github_advisory_id: "GHSA-1", severity: "moderate", module_name: "b-mod" },
      { id: 2, github_advisory_id: "GHSA-2", severity: "critical", module_name: "z-crit" },
      { id: 3, github_advisory_id: "GHSA-3", severity: "moderate", module_name: "a-mod" },
    ]),
  );

  assert.deepStrictEqual(
    sortBySeverity(advisories).map(a => a.module),
    ["z-crit", "a-mod", "b-mod"],
  );
}

// renderTable returns empty string for no advisories and a markdown table otherwise
{
  assert.strictEqual(renderTable([]), "");

  const table = renderTable(
    parseAudit(
      auditJson([
        {
          id: 1,
          github_advisory_id: "GHSA-xyz",
          severity: "high",
          module_name: "ws",
          title: "Vuln | with pipe",
          url: "https://example.com/GHSA-xyz",
        },
      ]),
    ),
  );

  assert.ok(table.includes("| Severity | Package |"));
  assert.ok(table.includes("[GHSA-xyz](https://example.com/GHSA-xyz)"));
  // Pipe characters in titles must be escaped so they don't break the table
  assert.ok(table.includes("Vuln \\| with pipe"));
}

console.log("✔ audit-diff.test.ts: all assertions passed");
