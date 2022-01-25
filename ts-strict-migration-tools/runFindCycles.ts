/* eslint-disable no-console */
/* eslint-disable indent */
import * as path from 'path';

import { findCycles } from './findCycles';
import { forEachFileInSrc } from './getStrictNullCheckEligibleFiles';
import { normalizeTsconfigPath } from './tsHelper';

const tsconfigPath = normalizeTsconfigPath(process.argv[2]);
const srcRoot = `${path.dirname(tsconfigPath)}/src`;

runFindCycles();

async function runFindCycles() {
  const files = await forEachFileInSrc(srcRoot);
  const cycles = findCycles(srcRoot, files);

  const singleFiles = [];
  let stronglyConnectedComponentCount = 0;
  for (const cycle of cycles) {
    if (cycle.length > 1) {
      console.log(`Found strongly connected component of size ${cycle.length}`);
      cycle.sort();
      for (const file of cycle) {
        console.log(`    ${file}`);
      }
      stronglyConnectedComponentCount++;
    } else {
      singleFiles.push(cycle[0]);
    }
  }

  console.log(`Found ${stronglyConnectedComponentCount} strongly connected components`);
  console.log(`Files not part of a strongly connected components (${singleFiles.length})`);
  singleFiles.sort();
  for (const file of singleFiles) {
    console.log(`    ${file}`);
  }
}
