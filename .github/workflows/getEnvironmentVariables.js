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
    console.log("Setting output: ", options.custom_version);
    // TODO Maybe eagerly kill the script if this branch doesn't exist
    core.setOutput("version", options.custom_version);
  })
  .parse();
