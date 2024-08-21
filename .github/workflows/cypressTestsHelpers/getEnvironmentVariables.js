const { Command } = require("commander");
const core = require("@actions/core");
const fetch = require("node-fetch");
const { Octokit } = require("@octokit/core");

const program = new Command();

program
  .name("Approve PR")
  .description("Approve and merge PR if patch release")
  .option("--version <version>", "version of a project")
  .option("--token <token>", "token for login to cloud")
  .option("--repo_token <repo_token>", "github token")
  .option("--project <project>", "release project")
  .action(async options => {
    const isOldVersion = await checkIfOldVersion(
      options.version,
      options.repo_token,
    );
    core.setOutput("IS_OLD_VERSION", isOldVersion);

    if (!isPatchRelease(options.version) && options.project == "CORE") {
      //If it's minor version, check services, to get one before current
      //Then create environment with this service, and big db
      const snapshotWithBigDB = "nqw0Qmbr";
      const versionBefore = await getServiceWithVersionOneBeforeVersion(
        options.version,
        options.token,
      );

      const environmentKey = await createEnvironment(
        options.version,
        options.token,
        versionBefore,
        snapshotWithBigDB,
      );

      //Update environment to current version
      await updateEnvironment(environmentKey, options.version, options.token);
      const domain = await getDomainForUpdatedEnvironment(
        environmentKey,
        options.token,
      );
      core.setOutput("url", `https://${domain}/`);
    } else {
      core.setOutput(
        "url",
        `https://v${getFormattedVersion(
          options.version,
        )}.staging.saleor.cloud/`,
      );
    }

    const branch = await getBranch(options.repo_token, options.version);
    core.setOutput("branch", branch);
  })
  .parse();

async function createEnvironment(version, token, versionBefore, snapshot) {
  const response = await fetch(
    `https://cloud.staging.saleor.io/api/organizations/saleor/environments/`,
    {
      method: "POST",
      body: `{ 
        "service": "${versionBefore}",
        "project": "staging",
        "name": "minor-release-test-${version}",
        "domain_label": "minor-release-${version}",
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

  if (!responseInJson.task_id)
    throw new Error(
      `Can't create environment- ${JSON.stringify(responseInJson)}`,
    );
  const throwErrorAfterTimeoutWhenCreatingEnv = setTimeout(function () {
    throw new Error("Environment didn't crated after 20 minutes");
  }, 1200000);
  return await waitUntilTaskInProgress(
    responseInJson.task_id,
    token,
    throwErrorAfterTimeoutWhenCreatingEnv,
  ).then(() => {
    clearTimeout(throwErrorAfterTimeoutWhenCreatingEnv);
    return responseInJson.key;
  });
}

async function updateEnvironment(environmentId, version, token) {
  console.log(
    `{ "service": "saleor-staging-v${getFormattedVersion(version)}" }`,
  );
  const response = await fetch(
    `https://cloud.staging.saleor.io/api/organizations/saleor/environments/${environmentId}/upgrade/`,
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
  const throwErrorAfterTimeout = setTimeout(function () {
    throw new Error("Environment didn't upgraded after 20 minutes");
  }, 1200000);
  await waitUntilTaskInProgress(
    responseInJson.task_id,
    token,
    throwErrorAfterTimeout,
  );
  clearTimeout(throwErrorAfterTimeout);
}

async function waitUntilTaskInProgress(taskId, token) {
  const response = await fetch(
    `https://cloud.staging.saleor.io/api/service/task-status/${taskId}/`,
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
    await new Promise(resolve =>
      setTimeout(function () {
        resolve(waitUntilTaskInProgress(taskId, token));
      }, 10000),
    );
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
    `https://cloud.staging.saleor.io/api/organizations/saleor/environments/${environmentId}`,
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

async function checkIfOldVersion(version, token) {
  const newestVersion = await getTheNewestVersion(token);
  const howManyVersionsBehind =
    getFormattedVersion(newestVersion) - getFormattedVersion(version);
  //All versions besides last three are old versions
  return howManyVersionsBehind > 2 ? "true" : "false";
}

async function getTheNewestVersion(token) {
  const octokit = new Octokit({
    auth: token,
  });

  const response = await octokit.request(
    "GET /repos/{owner}/{repo}/releases/latest",
    {
      owner: "saleor",
      repo: "saleor-dashboard",
    },
  );
  return response.data["tag_name"];
}

async function getServices(token) {
  // us-east-1
  const response = await fetch(
    `https://cloud.staging.saleor.io/api/regions/us-east-1/services`,
    {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    },
  );
  const responseInJson = await response.json();
  return responseInJson;
}

async function getServiceWithVersionOneBeforeVersion(version, token) {
  const services = await getServices(token);
  const sandboxServices = services.filter(
    element => element.service_type === "SANDBOX",
  );
  const sortedServices = sortServicesByVersion(sandboxServices);
  const currentService = sortedServices.find(service => {
    return service.name === `saleor-staging-v${getFormattedVersion(version)}`;
  });
  const serviceBeforeCurrent =
    sortedServices[sortedServices.indexOf(currentService) + 1];
  console.log(`Selected ${serviceBeforeCurrent.name} service`);
  return serviceBeforeCurrent.name;
}

function sortServicesByVersion(services) {
  // This function is used to sort environments by their version
  // It returns sorted list of services in descending order

  return services.sort(function (a, b) {
    //Convert version from string to array eg. from "3.5.7" to [3, 5, 7]
    // Where 3 is main version, 5 is major version and 7 is patch version

    const versionASplittedToArray = a.version.split(/\D/);
    const versionBSplittedToArray = b.version.split(/\D/);
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
  });
}

async function getBranch(token, version) {
  const regex = /^\d+\.\d+/;
  const formattedVersion = version.match(regex)[0];

  const octokit = new Octokit({
    auth: token,
  });

  try {
    const response = await octokit.request(
      `GET /repos/{owner}/{repo}/branches/${formattedVersion}`,
      {
        owner: "saleor",
        repo: "saleor-dashboard",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );
    return response.status == 200 ? response.data.name : "main";
  } catch (error) {
    return "main";
  }
}
