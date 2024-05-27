/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const { defineConfig } = require("cypress");
const fs = require("fs");

module.exports = defineConfig({
  projectId: "51ef7c",
  chromeWebSecurity: false,
  defaultCommandTimeout: 20000,
  requestTimeout: 20000,
  viewportWidth: 1400,
  viewportHeight: 660,
  retries: {
    runMode: 1,
    openMode: 0,
  },
  reporter: "junit",
  reporterOptions: {
    mochaFile: "results/test-output-[hash].xml",
    jenkinsMode: true,
    outputs: true,
    testCaseSwitchClassnameAndName: true,
  },
  e2e: {
    env: {
      grepFilterSpecs: true,
      grepOmitFiltered: true,
      numTestsKeptInMemory: 10,
      experimentalMemoryManagement: true,
    },
    baseUrl: process.env.BASE_URL,
    setupNodeEvents(on, config) {
      config = require("./cypress/support/cypress-grep/plugin")(config);
      config = require("./cypress/plugins/index.js")(on, config);
      on("after:spec", (spec, results) => {
        if (results && results.video) {
          return fs.unlink(results.video, function (err) {
            if (err) {
              console.warn(`Could not remove video - ${err}`);
            } else {
              console.log("File removed:", results.video);
            }
          });
        }
      });
      return config;
    },
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },
});
