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
    const isOldVersion = await checkIfOldVersion(options.version, options.repo_token);
    core.setOutput("IS_OLD_VERSION", isOldVersion);

    core.setOutput("url", `https://v${getFormattedVersion(options.version)}.staging.saleor.cloud/`);

    const branch = await getBranch(options.repo_token, options.version);
    core.setOutput("branch", branch);
  })
  .parse();

function getFormattedVersion(version) {
  const regex = /^\d+\.\d+\./;
  return version.match(regex)[0].replace(/\./g, "");
}

async function checkIfOldVersion(version, token) {
  const newestVersion = await getTheNewestVersion(token);
  const howManyVersionsBehind = getFormattedVersion(newestVersion) - getFormattedVersion(version);
  //All versions besides last three are old versions
  return howManyVersionsBehind > 2 ? "true" : "false";
}

async function getTheNewestVersion(token) {
  const octokit = new Octokit({
    auth: token,
  });

  const response = await octokit.request("GET /repos/{owner}/{repo}/releases/latest", {
    owner: "saleor",
    repo: "saleor-dashboard",
  });
  return response.data["tag_name"];
}

async function getServices(token) {
  // us-east-1
  const response = await fetch(
    `https://staging-cloud.saleor.io/platform/api/regions/us-east-1/services`,
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
