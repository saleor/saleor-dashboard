/**
 * @type {import('lint-staged').Configuration}
 */
const config = {
  "*.{js,jsx,ts,tsx,mjs,cjs}": ["eslint --cache --fix", "prettier --write"],
  "*.{json,css,md,yml,yaml}": ["prettier --write"],
  ".changeset/*.md": "node scripts/check-changesets.mjs",
  "package.json": "sort-package-json",
};

module.exports = config;
