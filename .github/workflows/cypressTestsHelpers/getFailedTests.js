const core = require("@actions/core");
const { Command } = require("commander");
const { statusAndID } = require("./getTestsResults");
const { failedTestCases } = require("./getTestsResults");

const program = new Command();

program
  .name("Get failed test")
  .description("Get info if notify on slack if tests failed")
  .option("--dashboard_url <dashboard_url>", "Cypress dashboard url")
  .action(async options => {
    const data = await statusAndID(options.dashboard_url);

    let testsStatus = data.status;

    if (testsStatus === "FAILED") {
      const testCases = await failedTestCases(data.runId);
      if (testCases.length >= 20) {
        core.setOutput("notifySlack", "true");
      }
    } else if (testsStatus === "FAILED") {
      core.setOutput("notifySlack", "true");
    }
  })
  .parse();
