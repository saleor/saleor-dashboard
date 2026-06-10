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
    // Ensure we cut x.yy from x.yy-HASH
    const regex = /^\d+\.\d+/;
    const formattedVersion = options.custom_version.match(regex)[0];

    console.log("Setting output: ", formattedVersion);
    // TODO Maybe eagerly kill the script if this branch doesn't exist
    core.setOutput("version", formattedVersion);
  })
  .parse();
