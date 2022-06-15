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
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    env: {
      grepFilterSpecs: true
    },
    setupNodeEvents(on, config) {
      config = require("./cypress/support/cypress-grep/plugin")(config);
      config = require("./cypress/plugins/index.js")(on, config);
      return config;
    },
    baseUrl: "https://automation-dashboard.staging.saleor.cloud/dashboard/",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}"
  }
});
