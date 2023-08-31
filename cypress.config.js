/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const { defineConfig } = require("cypress");
const fs = require("fs");
const cypressSplit = require("cypress-split");

module.exports = defineConfig({
  projectId: "51ef7c",
  chromeWebSecurity: false,
  defaultCommandTimeout: 20000,
  requestTimeout: 20000,
  viewportWidth: 1400,
  viewportHeight: 660,
  screenshotsFolder: "cypress/reports/mochareports",
  screenshotOnRunFailure: true,
  retries: {
    runMode: 1,
    openMode: 0,
  },
  reporter: "cypress-multi-reporters",
  screenshotOnRunFailure: true,
  reporterOptions: {
    configFile: "reporter-config.json",
  },
  e2e: {
    env: {
      grepFilterSpecs: true,
      grepOmitFiltered: true,
      numTestsKeptInMemory: 10,
      experimentalMemoryManagement: true,
    },
    async setupNodeEvents(on, config) {
      config = require("./cypress/support/cypress-grep/plugin")(config);
      config = await require("./cypress/plugins/index.js")(on, config);
      cypressSplit(on, config);
      return config;
    },
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },
});
