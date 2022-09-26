const { Octokit } = require("@octokit/core");
const { Command } = require("commander");
const { GraphQLClient } = require("graphql-request");

const program = new Command();

const repo = "saleor-cloud-deployments";
const owner = "saleor";

program
  .name("Approve PR")
  .description("Approve and merge PR if patch release")
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

    const testsStatus = await getTestsStatus(options.dashboard_url);

    const requestBody =
      testsStatus === "PASSED"
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
      testsStatus === "PASSED"
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

async function getTestsStatus(dashboardUrl) {
  const getProjectRegex = /\/projects\/([^\/]*)/;
  const getRunRegex = /\/runs\/([^\/]*)/;

  const requestVariables = {
    projectId: dashboardUrl.match(getProjectRegex)[1],
    buildNumber: dashboardUrl.match(getRunRegex)[1],
  };

  const client = new GraphQLClient("https://dashboard.cypress.io/graphql");

  const response = await client.request(
    `query ($projectId: String!, $buildNumber: ID!) {
      runByBuildNumber(buildNumber: $buildNumber, projectId: $projectId) {
        status
      }
    }`,
    requestVariables,
  );
  return response.runByBuildNumber.status;
}
