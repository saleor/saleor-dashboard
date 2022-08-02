const { Octokit } = require("octokit");
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
        ? "Cypress test passed"
        : "Some tests failed, need manual approve";
    const event = options.tests_status === "success" ? "APPROVE" : "COMMENT";

    try {
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
    } catch (e) {
      error(e.message);
      process.exit(2);
    }

    if (isPatchRelease(options.version) && options.tests_status === "success") {
      try {
        await octokit.request(
          "PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge",
          {
            owner,
            repo,
            pull_number: pullNumber,
          },
        );
      } catch (e) {
        error(e.message);
        process.exit(2);
      }
    }
  })
  .parse();

function isPatchRelease(version) {
  const regex = /\d+\.\d+\.[1-9]/;
  return version.match(regex) ? true : false;
}
