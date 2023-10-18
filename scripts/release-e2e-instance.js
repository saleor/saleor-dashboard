const util = require("node:util");
const exec = util.promisify(require("node:child_process").exec);

async function run() {
  const name = process.argv[2]
  await exec(`npx saleor env update ${name}-BUSY --name=${name}`);
}
run();