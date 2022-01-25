/* eslint-disable no-console */
/* eslint-disable indent */
import * as path from "path";

import { ErrorCounter } from "./errorCounter";
import { getExcludedFiles } from "./getStrictNullCheckEligibleFiles";

const tsconfigPath = normalizeTsconfigPath(process.argv[2]);
const projectRoot = path.dirname(tsconfigPath);

function normalizeTsconfigPath(tsconfigPath: string) {
  return path.resolve(tsconfigPath);
}

checkExcludedFiles();

async function checkExcludedFiles() {
  const filesToCheck = Array.from(await getExcludedFiles(tsconfigPath));
  const errorCounter = new ErrorCounter(tsconfigPath);

  errorCounter.start();
  for (let i = 0; i < filesToCheck.length; i++) {
    const relativeFilePath = path.relative(projectRoot, filesToCheck[i]);
    console.log(
      `Checking '${relativeFilePath}' (file ${i + 1}/${filesToCheck.length})`
    );

    const errorCount = await errorCounter.tryCheckingFile(relativeFilePath);
    if (errorCount === 0) {
      throw new Error("File can be removed from exclude array");
    }
  }
  errorCounter.end();
}
