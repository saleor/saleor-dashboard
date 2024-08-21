const { Command } = require("commander");
const fetch = require("node-fetch");

const program = new Command();

const pathToCloudAPI = "https://cloud.staging.saleor.io/platform/api/";

program
  .name("cleanEnvironments")
  .description("Clean environments")
  .option("--token <token>", "token fo login to cloud")
  .option("--snapshot <snapshot>", "snapshot to revert to")
  .action(async options => {
    const token = options.token;
    const snapshot = options.snapshot;
    const environmentsToClean = await getEnvironmentsForReleaseTesting(token);
    environmentsToClean.forEach(environment => {
      cleanEnvironment(environment, snapshot, token);
    });
  })
  .parse();

async function getEnvironmentsForReleaseTesting(token) {
  const environments = await getEnvironments(token);
  const environmentsForReleaseTesting = environments.filter(environment => {
    return (
      environment.domain.match(/^v\d*.staging/) ||
      environment.domain == "master.staging.saleor.cloud"
    );
  });
  return environmentsForReleaseTesting;
}

async function getEnvironments(token) {
  const response = await fetch(
    `${pathToCloudAPI}organizations/saleor/environments/`,
    {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    },
  );
  return await response.json();
}

async function cleanEnvironment(environment, snapshot, token) {
  const response = await fetch(
    `${pathToCloudAPI}organizations/saleor/environments/${environment.key}/restore/`,
    {
      method: "PUT",
      body: JSON.stringify({ restore_from: snapshot }),
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    },
  );
  const responseInJson = await response.json();
  if (
    responseInJson.non_field_errors
      ? responseInJson.non_field_errors
      : responseInJson.__all__
  ) {
    console.warn(
      `${environment.name}: ${
        responseInJson.non_field_errors
          ? responseInJson.non_field_errors
          : responseInJson.__all__
      }`,
    );
  } else {
    await waitUntilTaskInProgress(responseInJson.task_id, environment.name);
  }
}

async function waitUntilTaskInProgress(taskId, environment) {
  const throwErrorAfterTimeout = setTimeout(function () {
    throw new Error("Environment didn't upgrade after 30 minutes");
  }, 120000);

  while (true) {
    const response = await fetch(
      `${pathToCloudAPI}service/task-status/${taskId}/`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      },
    );
    const responseInJson = await response.json();
    switch (responseInJson.status) {
      case "PENDING":
      case "IN_PROGRESS":
        await new Promise(resolve => setTimeout(resolve, 10000));
        break;
      case "SUCCEEDED":
        console.log(
          `${environment}: Job ended with status - ${responseInJson.status} - ${responseInJson.job_name}`,
        );
        clearTimeout(throwErrorAfterTimeout);
        return responseInJson.status;
      default:
        clearTimeout(throwErrorAfterTimeout);
        throw console.warn(
          `${environment}: Job ended with status - ${responseInJson.status} - ${responseInJson.job_name}`,
        );
    }
  }
}
