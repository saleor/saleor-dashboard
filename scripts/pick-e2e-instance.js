const util = require("node:util");
const execFile = util.promisify(require("node:child_process").exec);

const toStateList = ({ name, domain }) => {
  return {
    name,
    domain: `https://${domain}`,
    busy: name.includes('BUSY')
  }
}

const obtainPrInstances = (envList) => {
  return JSON.parse(envList)
    .filter(({ project }) => project.name == "Project for PR testing")
    .map(({ name, domain }) => ({ name, domain }))
    .map(toStateList)
}

const takeFirstFree = (prInstances) => prInstances.find(({ busy }) => !busy)

const markAsBusy = async (name) => {
  await execFile(`npx saleor env update ${name} --name=${name}-BUSY`);
}

async function run() {

  const result = await execFile("npx saleor env list --json", { serialization: "json" });
  const envList = result.stdout.replace('\x1B[?25l\x1B[?25h', '')
  const prInstances = obtainPrInstances(envList)
  const firstFree = takeFirstFree(prInstances)

  if (!firstFree) {
    throw new Error("There are no free instances.")
  }

  await markAsBusy(firstFree.name)

  process.stdout.write(firstFree)
}
run();