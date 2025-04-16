const { Command } = require("commander");
const program = new Command();
const core = require("@actions/core");

program
  .name("Send tests results")
  .description("Post test results to Slack using CTRF")
  .option("--results_file <results_file>", "Path to CTRF results file")
  .option("--slack_webhook_url <slack_webhook_url>", "Slack webhook URL")
  .option("--environment <environment>", "Environment")
  .option("--url_to_action <url_to_action>", "URL to GitHub action")
  .option("--ref_name <ref_name>", "Ref to point where tests were run")
  .option("--additional_title <additional_title>", "Additional title, not required")
  .action(async options => {
    const resultsFile = options.results_file;
    const testsResults = require(resultsFile);
    const testsStatus = convertResults(
      testsResults,
      options.environment,
      options.ref_name,
      options.additional_title,
    );

    core.setOutput("status", testsStatus.status.toLowerCase());
    core.setOutput("message", testsStatus.message.replaceAll(/\n/g, ""));

    await sendMessageOnSlack(testsStatus, options.slack_webhook_url, options.url_to_action);
  })
  .parse();

function convertResults(results, environment, refName, additionalTitle) {
  const stats = results.statistics;
  const status = stats.failed === 0 ? "SUCCESS" : "FAILURE";

  let message = `Tests run on environment: \n${environment} \n`;

  if (stats.failed > 0) {
    message += `${stats.failed} tests failed. `;
  }
  if (stats.passed > 0) {
    message += `${stats.passed} tests passed. `;
  }
  if (stats.skipped > 0) {
    message += `${stats.skipped} tests skipped. `;
  }

  const title = additionalTitle ? additionalTitle : `Automation tests run on ${refName}`;

  return {
    status,
    message,
    title,
  };
}

async function sendMessageOnSlack(testsStatus, webhookUrl, urlToAction) {
  const JOB_STATUS_COLOR_MAP = {
    SUCCESS: "#5DC292",
    FAILURE: "#FE6E76",
  };

  const messageData = {
    attachments: [
      {
        fallback: testsStatus.message,
        pretext: testsStatus.status,
        title: testsStatus.title,
        title_link: urlToAction,
        text: testsStatus.message,
        color: JOB_STATUS_COLOR_MAP[testsStatus.status],
      },
    ],
  };

  await fetch(webhookUrl, {
    body: JSON.stringify(messageData),
    method: "post",
    headers: { "content-type": "application/json" },
  });
}
