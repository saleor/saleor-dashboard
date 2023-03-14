const { Command } = require("commander");
const fetch = require("node-fetch");

const program = new Command();

program
  .name("cleanEnvironments")
  .description("Clean environments")
  .option("--token <token>", "token fo login to cloud")
  .option("--snapshot <snapshot>", "snapshot to revert to")
  .action(async options => {
    const token = options.token;
    const snapshot = options.snapshot;
    const tasksArray = [];
    const environmentsToClean = await getEnvironmentsForReleaseTesting(token);
    environmentsToClean.forEach(environment => {
      tasksArray.push(cleanEnvironment(environment, snapshot, token));
    });
    const throwErrorAfterTimeout = setTimeout(function () {
      throw new Error("Environment didn't upgraded after 30 minutes");
    }, 1800000);
    Promise.all(tasksArray).then(tasksList => {
      tasksList.forEach(task => {
        if (task.error) {
          console.warn(`${task.environment}: ${task.error}`);
        } else {
          waitUntilTaskInProgress(task.taskId, task.environment, token);
        }
      });
    });
    clearTimeout(throwErrorAfterTimeout);
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
    `https://staging-cloud.saleor.io/api/organizations/saleor/environments/`,
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
    `https://staging-cloud.saleor.io/api/organizations/saleor/environments/${environment.key}/restore/`,
    {
      method: "PUT",
      body: `{
        "restore_from": "${snapshot}"
      }`,
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    },
  );
  const responseInJson = await response.json();
  return {
    taskId: responseInJson.task_id,
    environment: environment.name,
    error: responseInJson.non_field_errors,
  };
}

async function waitUntilTaskInProgress(taskId, environment, token) {
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
  console.log(`${environment} - Job status - ${responseInJson.status}`);
  if (
    responseInJson.status == "PENDING" ||
    responseInJson.status == "IN_PROGRESS"
  ) {
    await new Promise(resolve =>
      setTimeout(function () {
        resolve(waitUntilTaskInProgress(taskId, environment, token));
      }, 10000),
    );
  } else if (responseInJson.status == "SUCCEEDED") {
    return responseInJson.status;
  } else if (responseInJson.status !== "SUCCEEDED") {
    console.warn(
      `${environment}: Job ended with status - ${responseInJson.status} - ${responseInJson.job_name}`,
    );
  }
}
