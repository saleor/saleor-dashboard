/** @type {import('jest').Config} */
const config = {
  resetMocks: false,
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
