/* eslint-disable @typescript-eslint/no-var-requires */
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "51ef7c",
  chromeWebSecurity: false,
  videoUploadOnPasses: false,
  defaultCommandTimeout: 15000,
  requestTimeout: 15000,
  viewportWidth: 1400,
  viewportHeight: 660,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config);
    },
    baseUrl: "http://localhost:9000/",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}"
  }
});
