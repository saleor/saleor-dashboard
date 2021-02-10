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

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // make env variables visible for cypress
  config.env.API_URI = process.env.API_URI;
  config.env.APP_MOUNT_URI = process.env.APP_MOUNT_URI;

  on("before:browser:launch", (browser = {}, launchOptions) => {
    launchOptions.args.push("--proxy-bypass-list=<-loopback>");
    return launchOptions;
  });
  return config;
};
