const util = require("node:util");
const execFile = util.promisify(require("node:child_process").exec);

async function run() {
  await execFile(`npx saleor env update ${name} --name=${name}-BUSY`);
}
run();