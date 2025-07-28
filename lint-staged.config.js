/** @type {import('lint-staged').Config} */
const config = {
  "./{src,playwright}/**/*.{js,jsx,ts,tsx}": ["eslint --fix"],
};

module.exports = config;
