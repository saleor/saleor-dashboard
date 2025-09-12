/** @type {import('jest').Config} */
const config = {
  resetMocks: false,
  // Disable prettier for formatting snapshots - current jest version is using prettier 2.x which is incompatible with our 3.x version. When migrating to vitest - don't forget to remove this line.
  prettierPath: null,
  globals: {
    FLAGS_SERVICE_ENABLED: false,
    FLAGS: {},
  },
  globalSetup: "<rootDir>/testUtils/globalSetup.ts",
  setupFilesAfterEnv: [
    "jest-canvas-mock",
    "jest-localstorage-mock",
    "<rootDir>/testUtils/setup.ts",
  ],
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.(jsx?|tsx?)$": "@swc/jest",
    "^.+\\.(png|svg|jpe?g)$": "jest-file",
  },
  testRegex: ".*\\.test\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transformIgnorePatterns: ["/node_modules/(?!chroma-js/.*)"],
  moduleNameMapper: {
    "\\.(css)$": "identity-obj-proxy",
    "@assets(.*)$": "<rootDir>/assets/$1",
    "@locale(.*)$": "<rootDir>/locale/$1",
    "@dashboard(.*)$": "<rootDir>/src/$1",
    "@test/(.*)$": "<rootDir>/testUtils/$1",
    "^@material-ui/core$": "<rootDir>/node_modules/@material-ui/core",
    "^@material-ui/icons$": "<rootDir>/node_modules/@material-ui/icons",
    "^@material-ui/styles$": "<rootDir>/node_modules/@material-ui/styles",
    "^react$": "<rootDir>/node_modules/react",
    "^react-dom$": "<rootDir>/node_modules/react-dom",
    collectCoverageFrom: ["<rootDir>/src/**/*.{ts,tsx}"],
  },
};

module.exports = config;
