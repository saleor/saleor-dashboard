const { Command } = require("commander");
const core = require("@actions/core");
var request = require("xhr-request");

const program = new Command();

program
  .name("Approve PR")
  .description("Approve and merge PR if patch release")
  .option("--version <version>", "version of a project")
  .option("--token <token>", "token fo login to cloud")
  .action(async options => {
    if (!isPatchRelease(options.version)) {
      const environmentId = "2dPjdMTU";
      const taskId = await updateEnvironment(
        environmentId,
        options.version,
        options.token,
      );
      const throwErrorAfterTimeout = setTimeout(function() {
        throw new Error("Environment didn't upgraded after 20 minutes");
      }, 1200000);
      waitUntilTaskInProgress(taskId, options.token, throwErrorAfterTimeout);
      const domain = await getDomainForUpdatedEnvironment(
        environmentId,
        options.token,
      );
      core.setOutput("domain", `https://${domain}/`);
    } else {
      core.setOutput(
        "domain",
        `https://v${getFormattedVersion(
          options.version,
        )}.staging.saleor.cloud/`,
      );
    }
  })
  .parse();

async function updateEnvironment(environmentId, version, token) {
  return new Promise((resolve, reject) => {
    request(
      `https://staging-cloud.saleor.io/api/organizations/qa/environments/${environmentId}/upgrade/`,
      {
        method: "PUT",
        json: true,
        body: { service: `saleor-staging-v${getFormattedVersion(version)}` },
        responseType: "json",
        headers: {
          Authorization: `Token ${token}`,
        },
      },
      function(err, data) {
        if (err) throw err;
        console.log(data);
        if (!data.task_id)
          throw new Error(`Can't update environment- ${JSON.stringify(data)}`);
        resolve(data.task_id);
      },
    );
  });
}

function waitUntilTaskInProgress(taskId, token, throwErrorAfterTimeout) {
  request(
    `https://staging-cloud.saleor.io/api/service/task-status/${taskId}/`,
    {
      method: "GET",
      responseType: "json",
    },
    function(err, data) {
      console.log(data.status);
      if (err) throw err;
      if (data.status == "PENDING" || data.status == "IN_PROGRESS") {
        setTimeout(function() {
          waitUntilTaskInProgress(taskId, token);
        }, 10000);
      } else if (data.status == "SUCCEEDED") {
        clearTimeout(throwErrorAfterTimeout);
      } else if (data.status !== "SUCCEEDED") {
        throw new Error(
          `Job ended with status - ${data.status} - ${data.job_name}`,
        );
      }
    },
  );
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
  return new Promise((resolve, reject) => {
    request(
      `https://staging-cloud.saleor.io/api/organizations/qa/environments/${environmentId}`,
      {
        method: "GET",
        json: true,
        responseType: "json",
        headers: {
          Authorization: `Token ${token}`,
        },
      },
      function(err, data) {
        if (err) throw err;
        resolve(data.domain);
      },
    );
  });
}
