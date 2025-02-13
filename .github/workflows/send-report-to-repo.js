const { Octokit } = require("octokit")
const fs = require("fs");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});


const myJsonFile = fs.readFileSync("ctrf-reports/merged-report.json", {
  encoding: "base64",
});

const path = `newReports/test-report-${new Date().valueOf()}`

await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
  owner: "saleor",
  repo: "qa-helpers",
  path: path,
  message: "push new saleor-dashboard test report",
  content: myJsonFile,
  headers: {
    "X-GitHub-Api-Version": "2022-11-28",
  },
});
