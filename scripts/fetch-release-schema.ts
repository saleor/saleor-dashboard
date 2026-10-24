#!/usr/bin/env node

/**
 * Downloads schema.graphql attached to the newest published Saleor release
 * matching config.saleor.schemaVersion, so the main schema never contains
 * fields that are merged into the release branch but not yet deployed.
 *
 * Executed directly by Node's TypeScript type stripping (Node >= 24):
 *   node scripts/fetch-release-schema.ts
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const SCHEMA_FILE_PATH = path.join(ROOT, "schema-main.graphql");
const RELEASES_URL = "https://api.github.com/repos/saleor/saleor/releases?per_page=100";

export interface Release {
  tag_name: string;
  draft: boolean;
  prerelease: boolean;
  assets: Array<{ name: string; browser_download_url: string }>;
}

/** Returns the tag and schema URL of the newest published `<version>.<patch>` release. */
export function pickReleaseSchema(
  releases: Release[],
  version: string,
): { tag: string; url: string } {
  const patchOf = (tag: string): number => Number(tag.slice(version.length + 1));
  const candidates = releases.filter(
    release => !release.draft && !release.prerelease && release.tag_name.startsWith(`${version}.`),
  );

  if (candidates.length === 0) {
    throw new Error(`No published Saleor release found for ${version}.x`);
  }

  const latest = candidates.reduce((a, b) => (patchOf(b.tag_name) > patchOf(a.tag_name) ? b : a));
  const asset = latest.assets.find(({ name }) => name === "schema.graphql");

  if (!asset) {
    throw new Error(`Release ${latest.tag_name} has no schema.graphql asset`);
  }

  return { tag: latest.tag_name, url: asset.browser_download_url };
}

async function fetchOk(url: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new Error(`GET ${url}: ${response.status} ${response.statusText}`);
  }

  return response;
}

async function main(): Promise<void> {
  const { config } = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const releases: Release[] = JSON.parse(await (await fetchOk(RELEASES_URL, { headers })).text());
  const { tag, url } = pickReleaseSchema(releases, config.saleor.schemaVersion);

  console.log(`🔍 Fetching schema from Saleor release ${tag}`);

  fs.writeFileSync(SCHEMA_FILE_PATH, await (await fetchOk(url)).text(), "utf8");

  console.log(`✅ Schema saved to: ${SCHEMA_FILE_PATH}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error: Error) => {
    console.error("❌ Error fetching release schema:", error.message);
    process.exit(1);
  });
}
