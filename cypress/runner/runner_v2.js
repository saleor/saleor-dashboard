/* eslint-disable */

const cypress = require("cypress");
const glob = require("glob");

/* Parse args */

process.stdout.write(`argv - ${process.argv}\n`);

let { executors = 1, specs, filter, tags } = process.argv
  .slice(2)
  .reduce((acc, pair) => {
    let [key, value] = pair.split("=");
    acc[key] = value;
    return acc;
  }, {});

let resultsList = [];

process.exitCode = 0;

/* get list of all .spec files*/
specs = specs
  ? specs
  : glob
      .sync("cypress/integration/*")
      .filter(specPath =>
        typeof filter === "undefined" ? specPath : specPath.includes(filter)
      );

const initialSpecsCount = specs.length;
process.stdout.write(`Running cypress with ${executors} executors\n`);
process.stdout.write(`Running cypress with ${tags} tags\n`);
process.stdout.write(`Found ${initialSpecsCount} spec files\n`);

/* execute cypress run for spec file */
const cypressTask = (spec, envVariables) => {
  process.stdout.write(Object.keys(envVariables).toString());
  let newSpec = spec.includes(".js") ? spec : `${spec}/**/*`;
  return new Promise((resolve, reject) => {
    cypress
      .run({
        spec: spec,
        config: {
          video: true,
          videosFolder: `cypress/videos${newSpec}`
        },
        env: {
          tags: tags,
          ...envVariables
        }
      })
      .then(results => {
        resultsList.push(results);
        resolve();
        process.exitCode += results.totalFailed || 0;
      })
      .catch(err => {
        process.stdout.write(err);
        process.exitCode += 1;
      });
  });
};

/* pick spec from array and run cypress task */
function next() {
  if (specs.length > 0) {
    const globalHooks = {};
    // global before hook:
    specs.length === initialSpecsCount && (globalHooks.setupSuite = true);
    // global after hook:
    specs.length === 0 && (globalHooks.teardownSuite = true);

    const nextSpec = specs.shift();
    process.stdout.write(
      `PICKING UP NEXT TASK (${nextSpec}) ${initialSpecsCount -
        specs.length}/${initialSpecsCount}\n`
    );

    return cypressTask(nextSpec, globalHooks);
  } else {
    return Promise.reject("ALL SPECS PROCESSED\n");
  }
}

/* chain recursively cypress run task and picking another feature from array */
const chainer = () => {
  return new Promise(resolve => {
    resolve(
      (function recursive() {
        next()
          .then(recursive)
          .catch(e => process.stdout.write(e));
      })()
    );
  });
};

/* create array of executors */
let chains = Array.from({ length: executors }, chainer);

Promise.all(chains);

process.on("exit", code => {
  resultsList.forEach(element => {
    process.stdout.write(
      `\n\nTOTAL FAILED IN RUNNER: ${element.totalFailed.toString()}\n`
    );
    element.runs.forEach(run => {
      if (run.tests) {
        run.tests.forEach(test => {
          if (test.state !== "passed") {
            process.stdout.write("\ntitle: " + test.title.toString());
          }
        });
      }
    });
  });
  return console.log(`\nRunner process exit with code ${code}`);
});
