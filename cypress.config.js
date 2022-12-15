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
    runMode: 2,
    openMode: 1,
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
    baseUrl: "http://localhost:4173/",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },
});
