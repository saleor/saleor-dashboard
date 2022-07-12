/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */

const debug = require("debug")("cypress-grep");
const globby = require("globby");
const { getTestNames } = require("find-test-names");
const fs = require("fs");
const path = require("path");
const { version } = 10;
const { resolveConfig, parseGrep, shouldTestRun } = require("./utils");

/**
 * Prints the cypress-grep environment values if any.
 * @param {Cypress.PluginConfigOptions} config
 */
function cypressGrepPlugin(config) {
  if (!config || !config.env) {
    return config;
  }

  const { env } = config;

  debug("cypress-grep plugin version %s", version);
  debug("Cypress config env object: %o", env);

  const grep = env.grep ? String(env.grep) : undefined;
  if (grep) {
    console.log('cypress-grep: tests with "%s" in their names', grep.trim());
  }

  const grepTags = env.grepTags || env["grep-tags"];
  if (grepTags) {
    console.log('cypress-grep: filtering using tag(s) "%s"', grepTags);
    const parsedGrep = parseGrep(null, grepTags);
    debug("parsed grep tags %o", parsedGrep.tags);
  }

  const grepBurn = env.grepBurn || env["grep-burn"] || env.burn;
  if (grepBurn) {
    console.log("cypress-grep: running filtered tests %d times", grepBurn);
  }
  const grepUntagged = env.grepUntagged || env["grep-untagged"];
  if (grepUntagged) {
    console.log("cypress-grep: running untagged tests");
  }

  const omitFiltered = env.grepOmitFiltered || env["grep-omit-filtered"];
  if (omitFiltered) {
    console.log("cypress-grep: will omit filtered tests");
  }

  const { resolvedConfig } = resolveConfig(config);
  const { specPattern, excludeSpecPattern, integrationFolder } = resolvedConfig;

  const grepFilterSpecs = env.grepFilterSpecs === true;
  if (grepFilterSpecs) {
    debug(resolvedConfig);
    const specFiles = globby.sync(specPattern, {
      cwd: integrationFolder,
      ignore: excludeSpecPattern,
      absolute: true,
    });
    debug("found %d spec files", specFiles.length);
    debug("%o", specFiles);
    let greppedSpecs = [];
    if (grep) {
      console.log(
        'cypress-grep: filtering specs using "%s" in the title',
        grep,
      );
      const parsedGrep = parseGrep(grep);
      debug("parsed grep %o", parsedGrep);
      greppedSpecs = specFiles.filter(specFile => {
        const text = fs.readFileSync(specFile, { encoding: "utf8" });
        try {
          const names = getTestNames(text);
          const testAndSuiteNames = names.suiteNames.concat(names.testNames);
          debug("spec file %s", specFile);
          debug("suite and test names: %o", testAndSuiteNames);

          return testAndSuiteNames.some(name => {
            const shouldRun = shouldTestRun(parsedGrep, name);
            return shouldRun;
          });
        } catch (err) {
          debug(err.message);
          debug(err.stack);
          console.error("Could not determine test names in file: %s", specFile);
          console.error("Will run it to let the grep filter the tests");
          return true;
        }
      });
      debug('found grep "%s" in %d specs', grep, greppedSpecs.length);
      debug("%o", greppedSpecs);
    } else if (grepTags) {
      const parsedGrep = parseGrep(null, grepTags);
      debug("parsed grep tags %o", parsedGrep);
      greppedSpecs = specFiles.filter(specFile => {
        const text = fs.readFileSync(specFile, { encoding: "utf8" });
        try {
          const testInfo = getTestNames(text);
          debug("spec file %s", specFile);
          debug("test info: %o", testInfo.tests);

          return testInfo.tests.some(info => {
            const shouldRun = shouldTestRun(parsedGrep, null, info.tags);
            return shouldRun;
          });
        } catch (err) {
          console.error("Could not determine test names in file: %s", specFile);
          console.error("Will run it to let the grep filter the tests");
          return true;
        }
      });
      debug('found grep tags "%s" in %d specs', grepTags, greppedSpecs.length);
      debug("%o", greppedSpecs);
    }
    if (greppedSpecs.length) {
      config.specPattern = greppedSpecs;
      console.log(config.specPattern);
    } else {
      // hmm, we filtered out all specs, probably something is wrong
      console.warn("grep and/or grepTags has eliminated all specs");
      if (grep) {
        console.warn("grep: %s", grep);
      }
      if (grepTags) {
        console.warn("grepTags: %s", grepTags);
      }
      console.warn("Will leave all specs to run to filter at run-time");
    }
  }

  return config;
}

module.exports = cypressGrepPlugin;
