const { Command } = require("commander");
const program = new Command();
const core = require("@actions/core");
const { Octokit } = require("@octokit/core");

program
  .name("Check if deployment finished")
  .description(
    "Get all runs from deploy-staging.yml, get one with same head_sha, and wait until finished",
  )
  .option("--head_sha <head_sha>", "head_sha, to get correct deployment")
  .option("--github_token <github_token>", "github_token, to log in")
  .action(async options => {
    //set timeout
    const throwErrorIfCannotFindRun = setTimeout(function () {
      core.setOutput("checkStatus", "completed");
      core.setOutput("checkConclusion", "failure");
      core.setOutput("checkMessage", "Could not find deployment run");
      throw new Error("Couldn't find deployment run");
    }, 300000);

    const runDetails = await getRun(options.github_token, options.head_sha);
    const runId = runDetails.id;
    const runHtmlUrl = runDetails.html_url;

    clearTimeout(throwErrorIfCannotFindRun);

    // set timeout
    const throwErrorIfRunNotFinished = setTimeout(function () {
      core.setOutput("checkStatus", "completed");
      core.setOutput("checkConclusion", "failure");
      core.setOutput(
        "checkMessage",
        `Deployment run timeout, to check details enter: ${runHtmlUrl}`,
      );
      throw new Error("Deployment timeout");
    }, 600000);

    const run = await waitForRunToComplete(options.github_token, runId);

    clearTimeout(throwErrorIfRunNotFinished);

    console.log(run.status);
    console.log(run.conclusion);
    console.log(`Deployment succeeded, to check details enter: ${runHtmlUrl}`);

    core.setOutput("checkStatus", run.status);
    core.setOutput("checkConclusion", run.conclusion);
    core.setOutput(
      "checkMessage",
      `Deployment succeeded, to check details enter: ${runHtmlUrl}`,
    );
  })
  .parse();

async function getRun(githubToken, headSha) {
  // const octokit = new Octokit({
  //   auth: githubToken,
  // });
  const octokit = new Octokit();
  let foundRuns = [];
  console.log("before while");
  while (foundRuns.length === 0) {
    console.log("IN while");
    const runs = await octokit.request(
      "GET /repos/saleor/saleor-dashboard/actions/workflows/deploy-staging.yaml/runs",
      {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );
    const workflowRuns = runs.data.workflow_runs;
    foundRuns = workflowRuns.filter(workflowRun => {
      return workflowRun.head_sha === headSha;
    });
    if(foundRuns.length === 0) await new Promise(resolve => setTimeout(resolve, 10000));
  }
  return foundRuns[0];
}

async function waitForRunToComplete(githubToken, runId) {
  // const octokit = new Octokit({
  //   auth: githubToken,
  // });
  const octokit = new Octokit();

  let status = "";
  let conclusion = "";
  while (status !== "completed") {
    const run = await octokit.request(
      "GET /repos/saleor/saleor-dashboard/actions/runs/{run_id}",
      {
        run_id: runId,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );
    
    status = run.data.status;
    conclusion = run.data.conclusion;
    if(status !== "completed") await new Promise(resolve => setTimeout(resolve, 30000));
  }
  return { status, conclusion };
}
