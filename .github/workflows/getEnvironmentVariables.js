const { Command } = require("commander");
const core = require("@actions/core");
const { Octokit } = require("@octokit/core");

const program = new Command();

program
  .name("Approve PR")
  .description("Approve and merge PR if patch release")
  .option("--custom_version <custom_version>", "version of a project")
  .option("--repo_token <repo_token>", "github token")
  .action(async options => {

    const version = await getBranch(options.repo_token, options.custom_version);
    core.setOutput("version", version);
  })
  .parse();

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
