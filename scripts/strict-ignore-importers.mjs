#!/usr/bin/env node

/**
 * Finds all files with `@ts-strict-ignore` and traces their full importer tree.
 *
 * Uses dependency-cruiser to build a reverse import graph, then for each
 * strict-ignored file walks up the importer chain — following through
 * barrel files (index.ts) and re-exports so you see the real consumers.
 *
 * Usage: node scripts/strict-ignore-importers.mjs
 */

import { execSync } from "node:child_process";
import { basename } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");

// ── 1. Gather files with @ts-strict-ignore ──────────────────────────────────

function findStrictIgnoreFiles() {
  // Safe: no user input, hardcoded command
  const out = execSync(`grep -rl "@ts-strict-ignore" src/ --include="*.ts" --include="*.tsx"`, {
    cwd: ROOT,
    encoding: "utf8",
  });
  return new Set(out.trim().split("\n").filter(Boolean));
}

// ── 2. Build reverse import graph via dependency-cruiser ────────────────────

function buildReverseGraph() {
  console.error("⏳ Running dependency-cruiser (this takes a moment)…");

  // Safe: no user input, hardcoded command
  const json = execSync(`npx depcruise --output-type json --no-config src/`, {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 200 * 1024 * 1024,
  });

  const { modules } = JSON.parse(json);

  // reverseGraph: resolved target → Set of sources that import it
  const reverseGraph = new Map();

  for (const mod of modules) {
    if (!mod.dependencies) continue;
    for (const dep of mod.dependencies) {
      if (!dep.resolved || dep.couldNotResolve) continue;
      if (!reverseGraph.has(dep.resolved)) {
        reverseGraph.set(dep.resolved, new Set());
      }
      reverseGraph.get(dep.resolved).add(mod.source);
    }
  }

  console.error(`✅ Graph built: ${modules.length} modules, ${reverseGraph.size} imported files`);
  return reverseGraph;
}

// ── 3. Walk the importer tree ───────────────────────────────────────────────

function isBarrelFile(filePath) {
  const name = basename(filePath);
  return /^index\.(ts|tsx|js|jsx)$/.test(name);
}

/**
 * Recursively collect the full importer tree for `file`.
 * Barrel files (index.ts) are followed through — their importers are
 * included instead of (or in addition to) the barrel itself.
 *
 * Returns a Map: importer path → depth (shortest path distance).
 */
function traceImporters(file, reverseGraph) {
  const result = new Map();
  const visited = new Set();

  function walk(current, depth) {
    if (visited.has(current)) return;
    visited.add(current);

    const importers = reverseGraph.get(current);
    if (!importers) return;

    for (const imp of importers) {
      if (isBarrelFile(current)) {
        if (!result.has(current)) result.set(current, depth);
        walk(imp, depth);
      } else if (isBarrelFile(imp)) {
        if (!result.has(imp)) result.set(imp, depth);
        walk(imp, depth + 1);
      } else {
        if (!result.has(imp)) result.set(imp, depth);
      }
    }
  }

  walk(file, 1);
  return result;
}

// ── 4. Main ─────────────────────────────────────────────────────────────────

const strictIgnoreFiles = findStrictIgnoreFiles();
console.error(`📁 Found ${strictIgnoreFiles.size} files with @ts-strict-ignore`);

const reverseGraph = buildReverseGraph();

const results = [];

for (const file of [...strictIgnoreFiles].sort()) {
  const importers = traceImporters(file, reverseGraph);

  const barrels = [];
  const consumers = [];
  for (const [imp, depth] of importers) {
    if (isBarrelFile(imp)) {
      barrels.push({ path: imp, depth });
    } else {
      consumers.push({ path: imp, depth });
    }
  }

  const consumerDetails = consumers.map(c => ({
    ...c,
    alsoStrictIgnored: strictIgnoreFiles.has(c.path),
  }));

  const allConsumersStrict =
    consumers.length === 0 || consumerDetails.every(c => !c.alsoStrictIgnored);

  results.push({
    file,
    directImporterCount: reverseGraph.get(file)?.size ?? 0,
    totalConsumers: consumers.length,
    barrels,
    consumers: consumerDetails,
    ready: allConsumersStrict,
  });
}

// ── 5. Print output ─────────────────────────────────────────────────────────

const readyFiles = results.filter(r => r.ready);
const byConsumerCount = [
  { label: "0 consumers (leaf)", items: results.filter(r => r.totalConsumers === 0) },
  { label: "1 consumer", items: results.filter(r => r.totalConsumers === 1) },
  {
    label: "2-4 consumers",
    items: results.filter(r => r.totalConsumers >= 2 && r.totalConsumers <= 4),
  },
  { label: "5+ consumers", items: results.filter(r => r.totalConsumers >= 5) },
];

console.log("=".repeat(80));
console.log("  @ts-strict-ignore IMPORTER ANALYSIS");
console.log("=".repeat(80));
console.log();
console.log(`Total files with @ts-strict-ignore: ${results.length}`);
console.log(`Ready to fix (all consumers are already strict): ${readyFiles.length}`);
console.log();

console.log("Distribution by consumer count:");
for (const bucket of byConsumerCount) {
  console.log(`  ${bucket.label}: ${bucket.items.length}`);
}
console.log();

console.log("─".repeat(80));
console.log("READY TO FIX (no strict-ignored consumers):");
console.log("─".repeat(80));
for (const r of readyFiles) {
  const tag =
    r.totalConsumers === 0
      ? "[leaf]"
      : `[${r.totalConsumers} consumer${r.totalConsumers > 1 ? "s" : ""}]`;
  console.log(`  ${tag} ${r.file}`);
  for (const b of r.barrels) {
    console.log(`         ↳ via barrel: ${b.path}`);
  }
  for (const c of r.consumers) {
    console.log(`         → ${c.path}`);
  }
}

console.log();
console.log("─".repeat(80));
console.log("ALL FILES (detailed importer tree):");
console.log("─".repeat(80));

for (const r of results) {
  const readyMark = r.ready ? "✅" : "  ";
  console.log(
    `\n${readyMark} ${r.file}  (direct: ${r.directImporterCount}, total consumers: ${r.totalConsumers})`,
  );

  if (r.barrels.length > 0) {
    for (const b of r.barrels) {
      console.log(`     ↳ barrel: ${b.path}`);
    }
  }

  if (r.consumers.length > 0) {
    for (const c of r.consumers) {
      const strictTag = c.alsoStrictIgnored ? " ⚠️  @ts-strict-ignore" : "";
      console.log(`     → ${c.path}${strictTag}`);
    }
  } else {
    console.log("     (no consumers found — leaf file)");
  }
}

console.log();
console.log("─".repeat(80));
console.log("TOP 20 BY CONSUMER COUNT:");
console.log("─".repeat(80));
const sorted = [...results].sort((a, b) => b.totalConsumers - a.totalConsumers);
for (const r of sorted.slice(0, 20)) {
  const readyMark = r.ready ? "✅" : "❌";
  console.log(`  ${readyMark} ${r.totalConsumers.toString().padStart(4)} consumers  ${r.file}`);
}
