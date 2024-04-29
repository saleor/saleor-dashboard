const { Command } = require("commander");
const program = new Command();

program
  .name("Send tests results")
  .description(
    "Get tests results from testmo and post message to slack or on release PR",
  )
  .option("--run_id <run_id>", "Testmo run id")
  .option(
    "--testmo_token <testmo_token>",
    "Bearer token for authorization in testmo",
  )
  .option(
    "--slack_webhook_url <slack_webhook_url>",
    "Should send notification on slack",
  )
  .option("--environment <environment>", "Environment")
  .option("--url_to_action <url_to_action>", "Url to enter github action")
  .option("--ref_name <ref_name>", "Ref to point where tests where run")
  .action(async options => {
    const runId = options.run_id;
    const testmoAuthToken = options.testmo_token;
    const testsResults = await getTestsStatus(runId, testmoAuthToken);
    const testsStatus = convertResults(
      testsResults,
      options.environment,
      options.ref_name,
    );

    await sendMessageOnSlack(
      testsStatus,
      options.slack_webhook_url,
      options.url_to_action,
    );
  })
  .parse();

async function getTestsStatus(runId, testmoToken) {
  const runResult = await fetch(
    `https://saleor.testmo.net/api/v1/automation/runs/${runId}`,
    {
      headers: {
        Authorization: `Bearer ${testmoToken}`,
      },
    },
  );
  return await runResult.json();
}

function convertResults(results, environment, refName) {
  let status = results?.result?.status === 2 ? "SUCCESS" : "FAILURE";
  let message = `Tests run on environment: \n${environment}\n`;
  const linkToResults = `https:\/\/saleor.testmo.net\/automation\/runs\/view\/${results.result.id}`;

  message += `See results at ${linkToResults}`;

  return {
    status,
    message,
    title: `Tests run on ${refName}`,
    linkToResults,
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
