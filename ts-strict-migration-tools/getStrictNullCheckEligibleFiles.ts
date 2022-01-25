/* eslint-disable indent */
import glob from "glob";
import * as path from "path";
import * as ts from "typescript";

import { findCycles } from "./findCycles";
import { ImportTracker } from "./tsHelper";

function considerFile(file: string): boolean {
  return (
    (file.endsWith(".ts") || file.endsWith(".tsx")) &&
    !file.endsWith(".stories.tsx")
  );
}

function hasUncheckedImport(
  file: string,
  importsTracker: ImportTracker,
  checkedFiles: Set<string>
): boolean {
  const imports = importsTracker.getImports(file);
  for (const imp of imports) {
    if (!checkedFiles.has(imp)) {
      return true;
    }
  }
  return false;
}

export function forEachFileInSrc(srcRoot: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob(`${srcRoot}/**/*.ts?(x)`, (err, files) => {
      if (err) {
        return reject(err);
      }

      return resolve(files.filter(considerFile));
    });
  });
}

/**
 * This function returns the list of files that could be whitelisted next, because
 * they don't depend on any file that hasn't been whitelisted.
 */

export async function listStrictNullCheckEligibleFiles(
  srcRoot: string,
  checkedFiles: Set<string>
): Promise<Set<string>> {
  // checked files -> files from tsconfig
  // Specifies an allow list of files to include in the program. An error occurs if any of the files can’t be found.

  const importsTracker = new ImportTracker(srcRoot);

  const files = await forEachFileInSrc(srcRoot);

  // for each file found in src
  // verify on file list files from tsconfig
  return new Set(
    files.filter(file => {
      if (checkedFiles.has(file)) {
        return false;
      }
      return !hasUncheckedImport(file, importsTracker, checkedFiles);
    })
  );
}

/**
 * This function returns the list of cycles of files that could be whitelisted next, because
 * none of the file in that cycle don't depend on any file that hasn't been whitelisted.
 */
export async function listStrictNullCheckEligibleCycles(
  srcRoot: string,
  checkedFiles: Set<string>
): Promise<string[][]> {
  const importsTracker = new ImportTracker(srcRoot);

  const files = await forEachFileInSrc(srcRoot);
  const cycles = findCycles(srcRoot, files);
  return cycles.filter(filesInCycle => {
    // A single file is not a cycle
    if (filesInCycle.length <= 1) {
      return false;
    }

    let cycleIsChecked = true;
    for (const file of filesInCycle) {
      if (!checkedFiles.has(file)) {
        cycleIsChecked = false;
        break;
      }
    }

    // The whole cycle has already been whitelisted
    if (cycleIsChecked) {
      return false;
    }

    // All imports of all files in the cycle must have
    // been whitelisted for the cycle to be eligible
    for (const file of files) {
      if (hasUncheckedImport(file, importsTracker, checkedFiles)) {
        return false;
      }
    }
    return true;
  });
}

// interface TSConfig {
//   files: string[]
//   include: string[]
//   exclude: string[]
// }

/**
 * This function returns the list of files that have already been whitelisted into
 * --strictNullChecks.
 */
export async function getCheckedFiles(
  tsconfigPath: string
): Promise<Set<string>> {
  const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
  const configFileContent = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(tsconfigPath)
  );

  return new Set<string>(configFileContent.fileNames);
}
