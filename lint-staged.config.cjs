/**
 * @type {import('lint-staged').Configuration}
 */
const config = {
  // ESLint (React Compiler and GraphQL rules) runs in CI only; see eslint.config.mjs
  "*.{js,jsx,ts,tsx,mjs,cjs}": [
    "oxlint --fix --report-unused-disable-directives-severity=warn --no-error-on-unmatched-pattern",
    "prettier --write",
  ],
  "*.{json,css,md,yml,yaml}": ["prettier --write"],
  ".changeset/*.md": "pnpm run lint:changesets",
  "package.json": "sort-package-json",
};

module.exports = config;
