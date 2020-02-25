/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const fs = require("fs");
const readline = require("readline");

const updateSnapshot = process.argv.includes("-u");
const snapshotPath = ".travis/check-strict-null-errors.snapshot";
const shouldCount = /^src/;
let errors = 0;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on("line", line => {
  if (shouldCount.test(line)) {
    errors++;
  }
});

rl.on("close", () => {
  if (updateSnapshot) {
    fs.writeFileSync(snapshotPath, errors);
  } else {
    console.log(errors);
  }
});
