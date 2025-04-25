const { Command } = require("commander");
const fetch = require("node-fetch");
const core = require("@actions/core");

const program = new Command();

const pathToCloudAPI = "https://cloud.staging.saleor.io/platform/api/";

const snapshotName = "snapshot-automation-tests";

let sendWarningOnSlack = "false";
let warningMessage = "";

program
  .name("cleanEnvironments")
  .description("Clean environments")
  .option("--token <token>", "token fo login to cloud")
  .option(
    "--environments_to_clean_regex <environments_to_clean_regex>",
    "Regex for environment which need cleaning",
  )
  .action(async options => {
    const token = options.token;
    const environmentsToCleanRegex = new RegExp(
      options.environments_to_clean_regex,
    );
    const environmentsToClean = await getEnvironmentsToClean(
      token,
      environmentsToCleanRegex,
    );
    const snapshotsForRestore = await getSnapshotsForRestore(token);
    const sortedSnapshotList = sortSnapshots(snapshotsForRestore);
    environmentsToClean.forEach(environment => {
      const latestSnapshot = getLatestSnapshotForEnvironment(
        environment.service.version,
        sortedSnapshotList,
      );
      if (latestSnapshot) {
        cleanEnvironment(environment, latestSnapshot, token);
      } else {
        sendWarningOnSlack = "true";
        warningMessage += `Snapshot compatible with environment ${environment.domain} does not exist, please create snapshot on cloud staging.\n`;
      }
    });
    core.setOutput("sendWarningOnSlack", sendWarningOnSlack);
    core.setOutput("warningMessage", warningMessage);
  })
  .parse();

async function getEnvironmentsToClean(token, environmentsToCleanRegex) {
  const environments = await getEnvironments(token);
  const environmentsForReleaseTesting = environments.filter(environment => {
    return environment.domain.match(environmentsToCleanRegex)
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
      body: JSON.stringify({ restore_from: snapshot.key }),
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
    const warning = responseInJson.non_field_errors
      ? responseInJson.non_field_errors
      : responseInJson.__all__;
    console.warn(`${environment.name}: ${warning}`);
    sendWarningOnSlack = "true";
    warningMessage += `Could not revert snapshot on ${environment.domain}: ${warning}.\n`;
  } else {
    await waitUntilTaskInProgress(responseInJson.task_id, environment.name);
  }
}

async function getSnapshotsForRestore(token) {
  const snapshotsResponse = await fetch(
    `${pathToCloudAPI}organizations/saleor/backups/`,
    {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    },
  );
  const allSnapshots = await snapshotsResponse.json();
  return allSnapshots.filter(snapshot => {
    return snapshot.name.includes(snapshotName);
  });
}

function sortSnapshots(snapshotList) {
  // This function is used to sort snapshots by their version
  // It returns sorted list of snapshots in descending order

  return snapshotList.sort(function (a, b) {
    return compareVersions(a.saleor_version, b.saleor_version);
  });
}

function compareVersions(versionA, versionB) {
  // Convert version from string to array eg. from "3.5.7" to [3, 5, 7]
  // Where 3 is main version, 5 is major version and 7 is patch version

  const versionASplittedToArray = versionA.split(/\D/);
  const versionBSplittedToArray = versionB.split(/\D/);
  const mainVersionNumberA = versionASplittedToArray[0];
  const mainVersionNumberB = versionBSplittedToArray[0];
  const majorVersionNumberA = versionASplittedToArray[1];
  const majorVersionNumberB = versionBSplittedToArray[1];
  const patchVersionNumberA = versionASplittedToArray[2];
  const patchVersionNumberB = versionBSplittedToArray[2];

  //Compare two versions
  if (mainVersionNumberA !== mainVersionNumberB) {
    return mainVersionNumberB - mainVersionNumberA;
  } else if (majorVersionNumberA !== majorVersionNumberB) {
    return majorVersionNumberB - majorVersionNumberA;
  } else if (patchVersionNumberA !== patchVersionNumberB) {
    return patchVersionNumberB - patchVersionNumberA;
  } else return 0;
}

function getLatestSnapshotForEnvironment(environmentVersion, snapshotList) {
  const compatibleSnapshots = snapshotList.filter(snapshot => {
    return compareVersions(environmentVersion, snapshot.saleor_version) <= 0;
  });
  if (compatibleSnapshots.length > 0) {
    const latestSnapshot = compatibleSnapshots[0];
    return latestSnapshot;
  } else {
    console.warn(
      `Could not find snapshot for environment on version: ${environmentVersion}. Environment won't be cleaned`,
    );
    return null;
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
