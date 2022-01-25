/* eslint-disable no-console */
import * as fs from "fs";
import * as path from "path";

import { ErrorCounter } from "./errorCounter";
import {
  forEachFileInSrc,
  forEachFileInTestUtils,
  getExcludedFiles
} from "./getStrictNullCheckEligibleFiles";

const tsconfigPath = normalizeTsconfigPath(process.argv[2]);
const projectRoot = path.dirname(tsconfigPath);
const srcRoot = `${projectRoot}/src`;

function normalizeTsconfigPath(tsconfigPath: string): string {
  return path.resolve(tsconfigPath);
}

async function getAllFiles(): Promise<string[]> {
  const srcFiles = await forEachFileInSrc(srcRoot);
  const testFiles = await forEachFileInTestUtils(srcRoot);
  return srcFiles.concat(testFiles);
}

async function getFilesToCheck(excludedFiles: Set<string>): Promise<string[]> {
  const files = await getAllFiles();

  return files.filter(file => {
    const relativeFilePath = path.relative(projectRoot, file);
    return !excludedFiles.has(relativeFilePath);
  });
}

function excludeInConfig(relativeFilePath: string) {
  const config = JSON.parse(fs.readFileSync(tsconfigPath).toString());
  const exclude = config.exclude || [];
  const excludeIndex = exclude.indexOf(relativeFilePath);
  if (excludeIndex < 1) {
    exclude.push(relativeFilePath);
    exclude.sort();
    config.exclude = exclude;
    fs.writeFileSync(tsconfigPath, JSON.stringify(config, null, 2));
  }
}

verifyFilesWithTSC();

async function verifyFilesWithTSC() {
  const excludedFiles = await getExcludedFiles(tsconfigPath);
  const filesToCheck = await getFilesToCheck(excludedFiles);

  const errorCounter = new ErrorCounter(tsconfigPath);
  errorCounter.start();

  console.log(`Checking ${filesToCheck.length} files with tsc`);
  const globalErrorsCount = await errorCounter.tryCheckingFiles(filesToCheck);

  if (globalErrorsCount > 0) {
    console.log(`${globalErrorsCount} errors found. Iterating...`);
    for (let i = 0; i < filesToCheck.length; i++) {
      const relativeFilePath = path.relative(projectRoot, filesToCheck[i]);
      console.log(
        `Checking '${relativeFilePath}' (file ${i + 1}/${filesToCheck.length})`
      );

      const errorCount = await errorCounter.tryCheckingFile(relativeFilePath);
      if (errorCount === 0) {
        console.log("👍");
      } else {
        console.log(`💥 - ${errorCount}`);
        excludeInConfig(relativeFilePath);
      }
    }
  }

  errorCounter.end();
  console.log("DONE");
}
