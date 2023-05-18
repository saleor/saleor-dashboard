const { Command } = require("commander");
const { GraphQLClient } = require("graphql-request");

const program = new Command();
const client = new GraphQLClient("https://dashboard.cypress.io/graphql");

const statusAndID = dashboardUrl => getTestsStatusAndId(dashboardUrl);
const failedTestCases = runId => getFailedTestCases(runId);

async function getTestsStatusAndId(dashboardUrl) {
  const getProjectRegex = /\/projects\/([^\/]*)/;
  const getRunRegex = /\/runs\/([^\/]*)/;
  const requestVariables = {
    projectId: dashboardUrl.match(getProjectRegex)[1],
    buildNumber: dashboardUrl.match(getRunRegex)[1],
  };

  const throwErrorAfterTimeout = setTimeout(function () {
    throw new Error("Run have still running status, after all tests executed");
  }, 1200000);

  const data = await waitForTestsToFinish(requestVariables);

  clearTimeout(throwErrorAfterTimeout);
  return { status: data.status, runId: data.id };
}

async function waitForTestsToFinish(requestVariables) {
  return new Promise((resolve, reject) => {
    client
      .request(
        `query ($projectId: String!, $buildNumber: ID!) {
      runByBuildNumber(buildNumber: $buildNumber, projectId: $projectId) {
        status,
        id
      }
    }`,
        requestVariables,
      )
      .then(response => {
        if (response.runByBuildNumber.status === "RUNNING") {
          setTimeout(async function () {
            resolve(await waitForTestsToFinish(requestVariables));
          }, 10000);
        } else {
          resolve(response.runByBuildNumber);
        }
      });
  });
}

async function getFailedTestCases(runId) {
  const requestVariables = {
    input: {
      runId,
      testResultState: ["FAILED"],
    },
  };

  return new Promise((resolve, reject) => {
    client
      .request(
        `query RunTestResults($input: TestResultsTableInput!) {
          testResults(input: $input) {
            ... on TestResult {
            ...RunTestResult
            }
          }
        }
        fragment RunTestResult on TestResult {  id  titleParts  state}`,
        requestVariables,
      )
      .then(response => {
        resolve(response.testResults);
      });
  });
}

module.exports = { statusAndID, failedTestCases };
