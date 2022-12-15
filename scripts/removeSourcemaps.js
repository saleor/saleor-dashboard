/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const rimraf = require("rimraf");

/*
  When the sentry is enabled, remove sourcemaps
*/

if (
  process.env.SENTRY_ORG &&
  process.env.SENTRY_PROJECT &&
  process.env.SENTRY_DSN &&
  process.env.SENTRY_AUTH_TOKEN
) {
  rimraf("./build/**/*.js.map", () => console.log("Source maps removed."));
}
