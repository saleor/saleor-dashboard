#!/usr/bin/env node

/**
 * Lints changeset files in the `.changeset` folder.
 *
 * Rule: the only allowed semver bump type in a changeset is `patch`.
 *
 * A `minor` (or `major`) bump is intentionally NOT allowed in regular changesets.
 * Bumping the minor version is part of the minor release process and is done
 * manually by the release owner - not through changesets added in feature PRs.
 *
 * Executed directly by Node's TypeScript type stripping (Node >= 24), e.g.:
 *   node scripts/check-changesets.ts                 # scan the whole .changeset folder
 *   node scripts/check-changesets.ts <file> [...]    # check only the given files (used by lint-staged)
 */

import fs from "node:fs";
import path from "node:path";

const CHANGESET_DIR = path.join(import.meta.dirname, "..", ".changeset");

export const ALLOWED_TYPES: readonly string[] = ["patch"];

// Markdown files in `.changeset` that are not changesets and must be skipped.
const IGNORED_FILES = new Set<string>(["README.md"]);

/**
 * Extracts the bump types declared in a changeset's frontmatter.
 *
 * Frontmatter looks like:
 *   ---
 *   "saleor-dashboard": patch
 *   ---
 */
export function parseBumpTypes(content: string): string[] {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!match) {
    return [];
  }

  const frontmatter = match[1];
  const types: string[] = [];

  for (const line of frontmatter.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed) {
      continue;
    }

    // Matches: "package-name": type  /  package-name: type
    const entry = trimmed.match(/^["']?[^"':]+["']?\s*:\s*([a-zA-Z]+)\s*$/);

    if (entry) {
      types.push(entry[1].toLowerCase());
    }
  }

  return types;
}

function resolveFiles(): string[] {
  const argFiles = process.argv.slice(2);

  if (argFiles.length > 0) {
    return argFiles
      .map(file => path.resolve(file))
      .filter(file => file.endsWith(".md") && !IGNORED_FILES.has(path.basename(file)));
  }

  if (!fs.existsSync(CHANGESET_DIR)) {
    return [];
  }

  return fs
    .readdirSync(CHANGESET_DIR)
    .filter(file => file.endsWith(".md") && !IGNORED_FILES.has(file))
    .map(file => path.join(CHANGESET_DIR, file));
}

function main(): void {
  const files = resolveFiles();
  const errors: string[] = [];

  for (const file of files) {
    if (!fs.existsSync(file)) {
      continue;
    }

    const content = fs.readFileSync(file, "utf8");
    const types = parseBumpTypes(content);

    if (types.length === 0) {
      errors.push(
        `${path.relative(process.cwd(), file)}: missing or invalid changeset frontmatter.`,
      );
      continue;
    }

    const disallowed = types.filter(type => !ALLOWED_TYPES.includes(type));

    if (disallowed.length > 0) {
      errors.push(
        `${path.relative(process.cwd(), file)}: bump type "${disallowed.join(
          ", ",
        )}" is not allowed. Only "patch" is permitted in changesets.`,
      );
    }
  }

  if (errors.length > 0) {
    console.error("\n✖ Invalid changeset(s) found:\n");
    errors.forEach(error => console.error(`  - ${error}`));
    console.error(
      "\nOnly `patch` changesets are allowed.\n" +
        "Bumping the minor version is part of the minor release process and is performed\n" +
        "manually by the release owner - it must not be declared in a changeset.\n",
    );
    process.exit(1);
  }

  console.log(
    `✔ Checked ${files.length} changeset file(s): all use the allowed "patch" bump type.`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
