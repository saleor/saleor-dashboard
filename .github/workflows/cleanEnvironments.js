const { Command } = require("commander");
const core = require("@actions/core");
const util = require("node:util");
const exec = util.promisify(require("node:child_process").exec);

const program = new Command();

const snapshotName = "snapshot-automation-tests";

let sendWarningOnSlack = "false";
let warningMessage = "";

program
  .name("cleanEnvironments")
  .description("Clean environments")
  .option(
    "--environments_to_clean_regex <environments_to_clean_regex>",
    "Regex for environment which need cleaning",
  )
  .action(async options => {
    const environmentsToCleanRegex = new RegExp(
      options.environments_to_clean_regex,
    );
    const environments = await getEnvironments();
    const environmentsToClean = await getEnvironmentsToClean(
      environments,
      environmentsToCleanRegex,
    );
    const snapshotsForRestore = await getSnapshotsForRestore(environments);
    console.log(snapshotsForRestore);
    const sortedSnapshotList = sortSnapshots(snapshotsForRestore);
    environmentsToClean.forEach(environment => {
      const latestSnapshot = getLatestSnapshotForEnvironment(
        environment.service.version,
        sortedSnapshotList,
      );
      if (latestSnapshot) {
        cleanEnvironment(environment, latestSnapshot);
      } else {
        sendWarningOnSlack = "true";
        warningMessage += `Snapshot compatible with environment ${environment.domain} does not exist, please create snapshot on cloud staging.\n`;
      }
    });
    core.setOutput("sendWarningOnSlack", sendWarningOnSlack);
    core.setOutput("warningMessage", warningMessage);
  })
  .parse();

async function getEnvironmentsToClean(
  allEnvironments,
  environmentsToCleanRegex,
) {
  const environmentsForReleaseTesting = allEnvironments.filter(environment => {
    return environment.domain.match(environmentsToCleanRegex);
  });
  return environmentsForReleaseTesting;
}

async function getEnvironments() {
  const result = await exec("npx saleor env list --json", {
    serialization: "json",
  });
  const envList = result.stdout.replace("\x1B[?25l\x1B[?25h", "");
  return JSON.parse(envList);
}

async function cleanEnvironment(environment, snapshot) {
  console.log(`Restoring snapshot for environment ${environment.domain}`);
  const result = await exec(
    `npx saleor backup restore ${snapshot.key} --environment="${environment.key}" --skip-webhooks-update`,
    {
      serialization: "json",
    },
  );
  const response = result.stderr.replace("\x1B[?25l\x1B[?25h", "");

  if (!response.includes("Restore finished")) {
    const warning = response;
    console.warn(`${environment.name}: ${warning}`);
    sendWarningOnSlack = "true";
    warningMessage += `Could not revert snapshot on ${environment.domain}: ${warning}.\n`;
  } 
}

async function getSnapshotsForRestore(allEnvironments) {
  let allBackups = [];
  await Promise.all(
    allEnvironments.map(async environment => {
      const result = await exec(
        `npx saleor backup list --json --organization="saleor" --environment="${environment.key}"`,
        {
          serialization: "json",
        },
      );
      const backupListForSingleEnv = result.stdout.replace(
        "\x1B[?25l\x1B[?25h",
        "",
      );
      allBackups = allBackups.concat(JSON.parse(backupListForSingleEnv));
      return allBackups;
    }),
  );
  return allBackups.filter(snapshot => {
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
