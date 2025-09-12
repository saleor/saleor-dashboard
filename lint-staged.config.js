/**
 * @type {import('lint-staged').Configuration}
 */
const config = {
  "./{src,playwright}/**/*.{js,jsx,ts,tsx}": ["prettier --write", "eslint --cache --fix"],
  "./{src,playwright}/**/*.{json,css,scss,md}": ["prettier --write"],
  "package.json": "sort-package-json",
};

module.exports = config;
