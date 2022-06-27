/* eslint-disable @typescript-eslint/no-var-requires */
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "51ef7c",
  chromeWebSecurity: false,
  videoUploadOnPasses: false,
  defaultCommandTimeout: 20000,
  requestTimeout: 20000,
  viewportWidth: 1400,
  viewportHeight: 660,
  e2e: {
    env: {
      grepFilterSpecs: true,
    },
    setupNodeEvents(on, config) {
      config = require("./cypress/support/cypress-grep/plugin")(config);
      config = require("./cypress/plugins/index.js")(on, config);
      return config;
    },
    baseUrl: "http://localhost:9000/",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },
});
