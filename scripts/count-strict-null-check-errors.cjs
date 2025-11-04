const fs = require("fs");
const readline = require("readline");

const updateSnapshot = process.argv.includes("-u");
const snapshotPath = ".travis/check-strict-null-errors.snapshot";
const shouldCount = /^src/;
let errors = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on("line", line => {
  if (shouldCount.test(line)) {
    errors = [...errors, line];
  }
});

rl.on("close", () => {
  const output = errors.join("\n") + "\n";
  if (updateSnapshot) {
    fs.writeFileSync(snapshotPath, output);
  } else {
    console.log(output);
  }
});
