/* eslint-disable no-console */
/* eslint-disable indent */
import * as path from "path";

import {
  forEachFileInSrc,
  getCheckedFiles,
  listStrictNullCheckEligibleCycles,
  listStrictNullCheckEligibleFiles
} from "./getStrictNullCheckEligibleFiles";
import { getImportsForFile, normalizeTsconfigPath } from "./tsHelper";

const tsconfigPath = normalizeTsconfigPath(process.argv[2]);
const srcRoot = `${path.dirname(tsconfigPath)}/src`;

const printDependedOnCount = true;

findCandidates();

async function findCandidates() {
  const checkedFiles = await getCheckedFiles(tsconfigPath);
  const eligibleFiles = await listStrictNullCheckEligibleFiles(
    srcRoot,
    checkedFiles
  );
  const eligibleCycles = await listStrictNullCheckEligibleCycles(
    srcRoot,
    checkedFiles
  );

  if (eligibleCycles.length > 0) {
    console.log(
      "The following cycles are eligible for enabling strictNullChecks!"
    );
    for (const filesInCycle of eligibleCycles) {
      console.log(`Cycle of ${filesInCycle.length} files:`);
      for (const file of filesInCycle) {
        console.log(`  ${file}`);
      }
    }
  }

  const fileToImports = new Map<string, string[]>();
  for (const file of await forEachFileInSrc(srcRoot)) {
    fileToImports.set(file, getImportsForFile(file, srcRoot));
  }

  const fileToImportsSecondOrder = oneLevelDownImports(fileToImports);
  const fileToImportsThirdOrder = oneLevelDownImports(fileToImportsSecondOrder);

  const dependedOnCount = countImporters(eligibleFiles, fileToImports);
  const dependedOnCountThirdOrder = countImporters(
    eligibleFiles,
    fileToImportsThirdOrder
  );

  let fileDependencyCountArray = Array.from(
    dependedOnCountThirdOrder.entries()
  );
  fileDependencyCountArray = fileDependencyCountArray.sort(
    ([aFile, aCount], [bFile, bCount]) => {
      if (aCount !== bCount) {
        return bCount - aCount;
      } else {
        return aFile.localeCompare(bFile);
      }
    }
  );

  console.log(
    "Here at the list of files eligible for enabling strictNullChecks!"
  );
  console.log(
    "These files only depend on other files for which strictNullCheck has already been enabled."
  );
  if (printDependedOnCount) {
    console.log(
      "The dependency count is approximate (this script only resolves up to third order imports)."
    );
    for (const [file, count] of fileDependencyCountArray) {
      const formatted = toFormattedFilePath(file);
      const direct = dependedOnCount.get(file);
      console.log(
        `${formatted} — Depended on by >**${count}** files (${direct} direct imports)`
      );
    }
  } else {
    for (const [file /* count*/] of fileDependencyCountArray) {
      console.log(toFormattedFilePath(file));
    }
  }
}

function toFormattedFilePath(file: string) {
  // return `"./${path.relative(srcRoot, file)}",`;
  return `- [ ] \`"./${path.relative(srcRoot, file)}"\``;
}

// Input: a map of files to the list of 1st order imports (files directly imported)
// Output: a map of files to the list of 1st and 2nd order imports
function oneLevelDownImports(
  fileToImports: Map<string, string[]>
): Map<string, string[]> {
  const out = new Map<string, string[]>();

  for (const [file, imports] of fileToImports) {
    // Add direct imports
    const nestedImports = new Set(imports);

    // Add import of imports
    for (const imp of imports) {
      if (fileToImports.has(imp)) {
        for (const nestedImport of fileToImports.get(imp)) {
          nestedImports.add(nestedImport);
        }
      }
    }

    out.set(file, Array.from(nestedImports));
  }

  return out;
}

function countImporters(
  files: Set<string>,
  fileToImports: Map<string, string[]>
): Map<string, number> {
  const dependedOnCount = new Map<string, number>();
  for (const file of files) {
    dependedOnCount.set(file, 0);
  }

  for (const [, /* file*/ imports] of fileToImports) {
    for (const imp of imports) {
      if (dependedOnCount.has(imp)) {
        dependedOnCount.set(imp, dependedOnCount.get(imp) + 1);
      }
    }
  }

  return dependedOnCount;
}
