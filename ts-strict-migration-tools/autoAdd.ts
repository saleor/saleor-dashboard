/* eslint-disable no-console */
/* eslint-disable indent */
import * as fs from "fs";
import * as path from "path";

import { ErrorCounter } from "./errorCounter";
import {
  getCheckedFiles,
  listStrictNullCheckEligibleFiles
} from "./getStrictNullCheckEligibleFiles";
import { normalizeTsconfigPath } from "./tsHelper";

const tsconfigPath = normalizeTsconfigPath(process.argv[2]);
const projectRoot = path.dirname(tsconfigPath);
const srcRoot = `${projectRoot}/src`;

tryAutoAddStrictNulls();

async function tryAutoAddStrictNulls() {
  let hasAddedFile = true;
  const checkedFiles = await getCheckedFiles(tsconfigPath);

  const errorCounter = new ErrorCounter(tsconfigPath);

  // As long as auto-add adds a file, it's possible there's a new file that
  // depends on one of the newly-added files that can now be strict null checked
  while (hasAddedFile) {
    hasAddedFile = false;

    const eligibleFiles = await listStrictNullCheckEligibleFiles(
      srcRoot,
      checkedFiles
    );

    errorCounter.start(eligibleFiles);
    const eligibleFilesArr = Array.from(eligibleFiles);
    for (let i = 0; i < eligibleFilesArr.length; i++) {
      const relativeFilePath = path.relative(projectRoot, eligibleFilesArr[i]);
      console.log(
        `Trying to auto add '${relativeFilePath}' (file ${i + 1}/${
          eligibleFilesArr.length
        })`
      );

      const errorCount = await errorCounter.tryCheckingFile(relativeFilePath);
      if (errorCount === 0) {
        console.log("👍");
        addFileToConfig(relativeFilePath);
        hasAddedFile = true;
      } else {
        console.log(`💥 - ${errorCount}`);
      }

      // No point in trying to whitelist the file twice, regardless or success or failure
      checkedFiles.add(eligibleFilesArr[i]);
    }
    errorCounter.end();
  }
}

function addFileToConfig(relativeFilePath: string) {
  const config = JSON.parse(fs.readFileSync(tsconfigPath).toString());
  const excludeIndex = config.exclude.indexOf(relativeFilePath);
  if (excludeIndex >= 0) {
    config.exclude.splice(excludeIndex, 1);
  }
  config.files = Array.from(
    new Set((config.files || []).concat(relativeFilePath).sort())
  );

  fs.writeFileSync(tsconfigPath, JSON.stringify(config, null, 2));
}

function removeFileFromConfig(relativeFilePath: string) {
  const config = JSON.parse(fs.readFileSync(tsconfigPath).toString());
  const excludeIndex = config.exclude.indexOf(relativeFilePath);
  if (excludeIndex >= 0) {
    config.exclude.splice(excludeIndex, 1);
    fs.writeFileSync(tsconfigPath, JSON.stringify(config, null, 2));
  }
}
