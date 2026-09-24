// Downloads schema.graphql attached to the newest published Saleor release
// matching config.saleor.schemaVersion, so the main schema never contains
// fields that are merged into the release branch but not yet deployed.
const fs = require("fs");
const path = require("path");

const { config } = require("../package.json");

const SCHEMA_VERSION = config.saleor.schemaVersion;
const SCHEMA_FILE_PATH = path.join(__dirname, "..", "schema-main.graphql");
const RELEASES_URL = "https://api.github.com/repos/saleor/saleor/releases?per_page=100";

const headers = { Accept: "application/vnd.github+json" };

if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

const getJson = async url => {
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`GET ${url}: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

const patchOf = tag => Number(tag.slice(SCHEMA_VERSION.length + 1));

async function fetchReleaseSchema() {
  const tagPattern = new RegExp(`^${SCHEMA_VERSION.replace(/\./g, "\\.")}\\.\\d+$`);
  const releases = (await getJson(RELEASES_URL)).filter(
    release => !release.draft && !release.prerelease && tagPattern.test(release.tag_name),
  );

  if (releases.length === 0) {
    throw new Error(`No published Saleor release found for ${SCHEMA_VERSION}.x`);
  }

  const latest = releases.reduce((a, b) => (patchOf(b.tag_name) > patchOf(a.tag_name) ? b : a));
  const asset = latest.assets.find(({ name }) => name === "schema.graphql");

  if (!asset) {
    throw new Error(`Release ${latest.tag_name} has no schema.graphql asset`);
  }

  console.log(`🔍 Fetching schema from Saleor release ${latest.tag_name}`);

  const response = await fetch(asset.browser_download_url);

  if (!response.ok) {
    throw new Error(`GET ${asset.browser_download_url}: ${response.status}`);
  }

  fs.writeFileSync(SCHEMA_FILE_PATH, await response.text(), "utf8");

  console.log(`✅ Schema saved to: ${SCHEMA_FILE_PATH}`);
}

fetchReleaseSchema().catch(error => {
  console.error("❌ Error fetching release schema:", error.message);
  process.exit(1);
});
