/**
 * @type {import('lint-staged').Configuration}
 */
const config = {
  "*.{js,jsx,ts,tsx,mjs,cjs}": ["eslint --cache --fix", "prettier --write"],
  "*.{json,css,md,yml,yaml}": ["prettier --write"],
  ".changeset/*.md": "pnpm run lint:changesets",
  "package.json": "sort-package-json",
};

module.exports = config;
