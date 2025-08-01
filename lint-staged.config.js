/**
 * @type {import('lint-staged').Configuration}
 */
const config = {
  "./{src,playwright}/**/*.{js,jsx,ts,tsx}": ["eslint --cache --fix"],
  "package.json": "sort-package-json",
};

module.exports = config;
