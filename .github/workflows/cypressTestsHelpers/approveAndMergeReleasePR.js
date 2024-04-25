const { Octokit } = require("@octokit/core");
const { Command } = require("commander");
const { GraphQLClient } = require("graphql-request");
const { statusAndID } = require("./getTestsResults");
const { failedTestCases } = require("./getTestsResults");

const program = new Command();
const client = new GraphQLClient("https://dashboard.cypress.io/graphql");

const repo = "saleor-cloud-deployments";
const owner = "saleor";

program
  .name("Approve PR")
  .description("Approve and merge PR if patch release")
  .option("--version <version>", "version of a project")
  .option("--pull_request_number <pull_request_number>", "Pull Request number")
  .option("--auto_release", "is auto release")
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

    const data = await statusAndID(options.dashboard_url);

    let testsStatus = data.status;

    let requestBody = `Cypress tests passed. See results at ${options.dashboard_url}`;

    if (testsStatus === "FAILED") {
      const failedNewTests = [];
      const listOfTestIssues = await getListOfTestsIssues(octokit);
      const testCases = await failedTestCases(data.runId);
      testCases.forEach(testCase => {
        if (testCase.titleParts) {
          const issue = issueOnGithub(listOfTestIssues, testCase.titleParts[1]);
          if (issue) {
            const knownBug = isIssueAKnownBugForReleaseVersion(
              issue,
              options.version,
            );
            if (!knownBug) {
              failedNewTests.push({
                title: testCase.titleParts[1],
                url: issue.html_url,
                spec: testCase.titleParts[0],
              });
            }
          } else {
            failedNewTests.push({
              title: testCase.titleParts[1],
              spec: testCase.titleParts[0],
            });
          }
        }
      });

      if (failedNewTests.length === 0) {
        requestBody = `All failed tests are known bugs, can be merged. See results at ${options.dashboard_url}`;
        testsStatus = "PASSED";
      } else if (failedNewTests.length > 10) {
        //If there are more than 10 new bugs it's probably caused by something else. Server responses with 500, or test user was deleted, etc.

        requestBody =
          "There is more than 10 new bugs, check results manually and create issues for them if necessary";
      } else {
        requestBody = `New bugs found, results at: ${options.dashboard_url}. List of issues to check: `;
        for (const newBug of failedNewTests) {
          if (!newBug.url) {
            requestBody += `\n${newBug.title}`;
          } else {
            requestBody += `\n${newBug.title} - ${newBug.url}`;
          }
        }
        requestBody += `\nIf this bugs won't be fixed in next patch release for this version mark them as known issues`;
      }
    } else if (testsStatus === "ERRORED") {
      requestBody = `Tests ERRORED! Check log at ${options.dashboard_url}`;
    }

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
          merge_method: "squash",
        },
      );
    }
  })
  .parse();

function isPatchRelease(version) {
  const regex = /\d+\.\d+\.[1-9]/;
  return version.match(regex) ? true : false;
}

async function getListOfTestsIssues(octokit) {
  const result = await octokit.request(
    "GET /repos/{owner}/saleor-dashboard/issues?labels=tests",
    {
      owner,
    },
  );
  return result.data;
}

function issueOnGithub(listOfTestIssues, testCaseTitle) {
  if (listOfTestIssues.length > 0) {
    return listOfTestIssues.find(issue => {
      return issue.title.includes(testCaseTitle);
    });
  }
}

function isIssueAKnownBugForReleaseVersion(issue, releaseVersion) {
  const issueBody = issue.body;
  const regex = /Known bug for versions:([\s\S]*)Additional/;
  const lines = issueBody.match(regex)[1].split("\n");
  const lineContainReleaseVersionRegex = /v(\d{2,3}).*(true|false)/;
  const releaseVersionLine = lines.find(line => {
    if (line.match(lineContainReleaseVersionRegex)) {
      const version = line.match(lineContainReleaseVersionRegex)[1];
      if (version === getFormattedVersion(releaseVersion)) {
        return line;
      }
    }
  });
  const knownBugOnReleaseVersion = releaseVersionLine
    ? releaseVersionLine.match(lineContainReleaseVersionRegex)[2]
    : false;
  return knownBugOnReleaseVersion === "true" ? true : false;
}

function getFormattedVersion(version) {
  const regex = /^\d+\.\d+\./;
  return version.match(regex)[0].replace(/\./g, "");
}
