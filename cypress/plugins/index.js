// / <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { urlList } = require("../url/urlList");

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  config.env.API_URI = urlList.apiUri;
  on("before:browser:launch", (browser = {}, launchOptions) => {
    launchOptions.args.push("--proxy-bypass-list=<-loopback>");
    return launchOptions;
  });
  return config;
};
