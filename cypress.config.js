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
  retries: {
    runMode: 1,
    openMode: 0,
  },
  screenshotsFolder: "cypress/reports/mochareports",
  reporter: "cypress-multi-reporters",
  reporterOptions: {
    configFile: "reporter-config.json",
  },
  e2e: {
    env: {
      grepFilterSpecs: true
    },
    baseUrl: process.env.BASE_URL,
    setupNodeEvents(on, config) {
      config = require("./cypress/support/cypress-grep/plugin")(config);
      config = require("./cypress/plugins/index.js")(on, config);
      return config;
    },
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },
});
