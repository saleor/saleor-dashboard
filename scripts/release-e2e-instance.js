const util = require("node:util");
const execFile = util.promisify(require("node:child_process").exec);

async function run() {
  const name = process.argv[2]
  await execFile(`npx saleor env update ${name}-BUSY --name=${name}`);
}
run();