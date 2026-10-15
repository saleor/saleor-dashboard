/**
 * @type {import('lint-staged').Configuration}
 */
const config = {
  // ESLint (GraphQL rules) runs in CI only; see eslint.config.mjs
  "*.{js,jsx,ts,tsx,mjs,cjs}": [
    "oxlint --fix --report-unused-disable-directives-severity=warn --no-error-on-unmatched-pattern",
    "oxfmt --write --no-error-on-unmatched-pattern",
  ],
  "*.{json,css,md,yml,yaml}": ["oxfmt --write --no-error-on-unmatched-pattern"],
  ".changeset/*.md": "pnpm run lint:changesets",
  "package.json": "sort-package-json",
};

module.exports = config;
