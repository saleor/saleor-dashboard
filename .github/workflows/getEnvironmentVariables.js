const { Command } = require("commander");
const core = require("@actions/core");
const fetch = require("node-fetch");
const { Octokit } = require("@octokit/core");

const program = new Command();

program
  .name("Approve PR")
  .description("Approve and merge PR if patch release")
  .option("--version <version>", "version of a project")
  .option("--token <token>", "token fo login to cloud")
  .action(async options => {
    const isOldVersion = await checkIfOldVersion(options.version);
    core.setOutput("IS_OLD_VERSION", isOldVersion);

    if (!isPatchRelease(options.version)) {
      const taskId = await updateEnvironment(
        environmentId,
        options.version,
        options.token,
      );
      const throwErrorAfterTimeout = setTimeout(function() {
        throw new Error("Environment didn't upgraded after 20 minutes");
      }, 1200000);
      await waitUntilTaskInProgress(
        taskId,
        options.token,
        throwErrorAfterTimeout,
      );
      const domain = await getDomainForUpdatedEnvironment(
        environmentId,
        options.token,
      );
      clearTimeout(throwErrorAfterTimeout);
      core.setOutput("url", `https://${domain}/`);
    } else {
      core.setOutput(
        "url",
        `https://v${getFormattedVersion(
          options.version,
        )}.staging.saleor.cloud/`,
      );
    }
  })
  .parse();

async function updateEnvironment(environmentId, version, token) {
  const response = await fetch(
    `https://staging-cloud.saleor.io/api/organizations/qa/environments/${environmentId}/upgrade/`,
    {
      method: "PUT",
      body: `{ "service": "saleor-staging-v${getFormattedVersion(version)}" }`,
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    },
  );
  const responseInJson = await response.json();
  if (!responseInJson.task_id)
    throw new Error(
      `Can't update environment- ${JSON.stringify(responseInJson)}`,
    );
  return responseInJson.task_id;
}

async function waitUntilTaskInProgress(taskId, token) {
  const response = await fetch(
    `https://staging-cloud.saleor.io/api/service/task-status/${taskId}/`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    },
  );
  const responseInJson = await response.json();
  console.log(`Job status - ${responseInJson.status}`);
  if (
    responseInJson.status == "PENDING" ||
    responseInJson.status == "IN_PROGRESS"
  ) {
    setTimeout(function() {
      waitUntilTaskInProgress(taskId, token);
    }, 10000);
  } else if (responseInJson.status == "SUCCEEDED") {
    return responseInJson.status;
  } else if (responseInJson.status !== "SUCCEEDED") {
    console.log("error");

    throw new Error(
      `Job ended with status - ${responseInJson.status} - ${responseInJson.job_name}`,
    );
  }
}

function isPatchRelease(version) {
  const regex = /\d+\.\d+\.[1-9]/;
  return version.match(regex) ? true : false;
}

function getFormattedVersion(version) {
  const regex = /^\d+\.\d+\./;
  return version.match(regex)[0].replace(/\./g, "");
}

async function getDomainForUpdatedEnvironment(environmentId, token) {
  const response = await fetch(
    `https://staging-cloud.saleor.io/api/organizations/qa/environments/${environmentId}`,
    {
      method: "GET",
      json: true,
      responseType: "json",
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
  const responseInJson = await response.json();
  return responseInJson.domain;
}

async function checkIfOldVersion(version) {
  const newestVersion = await getTheNewestVersion();
  const howManyVersionsBehind =
    getFormattedVersion(newestVersion) - getFormattedVersion(version);
  //All versions besides last three are old versions
  return howManyVersionsBehind > 2 ? "true" : "false";
}

async function getTheNewestVersion() {
  const octokit = new Octokit();

  const response = await octokit.request(
    "GET /repos/{owner}/{repo}/releases/latest",
    {
      owner: "saleor",
      repo: "saleor-dashboard",
    },
  );
  return response.data["tag_name"];
}
