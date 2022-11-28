/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const { defineConfig } = require("cypress");
const _ = require("lodash");
const fs = require("fs");

module.exports = defineConfig({
  projectId: "51ef7c",
  videoCompression: 15,
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
  e2e: {
    env: {
      grepFilterSpecs: true,
    },
    setupNodeEvents(on, config) {
      config = require("./cypress/support/cypress-grep/plugin")(config);
      config = require("./cypress/plugins/index.js")(on, config);
      on("after:spec", (spec, results) => {
        if (results && results.video) {
          // Do we have failures for any retry attempts?
          const failures = _.some(results.tests, test =>
            _.some(test.attempts, { state: "failed" }),
          );
          if (!failures) {
            // delete the video if the spec passed and no tests retried
            return fs.unlink(results.video, function(err) {
              if (err) {
                console.warn(`Could not remove video - ${err}`);
              } else {
                console.log("File removed:", results.video);
              }
            });
          }
        }
      });
      return config;
    },
    baseUrl: "http://localhost:9000/",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },
});
