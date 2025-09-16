/**
 * @type {import('lint-staged').Configuration}
 */
const config = {
  "./{src,playwright,scripts}/**/*.{js,jsx,ts,tsx}": ["eslint --cache --fix", "prettier --write"],
  "*.{json,css,md,yml,yaml}": ["prettier --write"],
  "package.json": "sort-package-json",
};

module.exports = config;
