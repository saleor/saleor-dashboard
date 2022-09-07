const { Octokit } = require("@octokit/core");
const { Command } = require("commander");

const program = new Command();

const repo = "saleor-cloud-deployments";
const owner = "saleor";

program
  .name("Approve PR")
  .description("Approve and merge PR if patch release")
  .option("--tests_status <tests_status>", `tests status`)
  .option("--version <version>", "version of a project")
  .option("--pull_request_number <pull_request_number>", "Pull Request number")
  .option("--auto_release <auto_release>", "is auto release")
  .option("--dashboard_url <dashboard_url>", "Cypress dashboard url")
  .action(async options => {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    const pullNumber = options.pull_request_number;

    const pullRequest = await octokit.request(
      "GET /repos/{owner}/{repo}/pulls/{pull_number}",
      {
        owner,
        repo,
        pull_number: pullNumber,
      },
    );

    const commitId = pullRequest.data.merge_commit_sha;
    const requestBody =
      options.tests_status === "success"
        ? `Cypress tests passed. See results at ${options.dashboard_url}`
        : `Some tests failed, need manual approve. See results at ${options.dashboard_url}`;
    const event = "COMMENT";

    await octokit.request(
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews",
      {
        owner,
        repo,
        pull_number: pullNumber,
        commit_id: commitId,
        body: requestBody,
        event,
        comments: [],
      },
    );

    if (
      options.auto_release &&
      isPatchRelease(options.version) &&
      options.tests_status === "success"
    ) {
      await octokit.request(
        "PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge",
        {
          owner,
          repo,
          pull_number: pullNumber,
        },
      );
    }
  })
  .parse();

function isPatchRelease(version) {
  const regex = /\d+\.\d+\.[1-9]/;
  return version.match(regex) ? true : false;
}
