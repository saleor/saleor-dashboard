/* eslint-disable indent */
import { getImportsForFile } from './tsHelper';

// Uses Kosaraju's algorithm to find strongly-connected components
// in the codebase's dependency graph. See the wikipedia article
// for why it works.
// https://en.wikipedia.org/wiki/Kosaraju%27s_algorithm
//
// Return a list of (list of files in a cycle, which may be just one file).
export function findCycles(srcRoot: string, files: string[]): string[][] {
  const imports = new Map<string, string[]>();
  const importers = new Map<string, Set<string>>();

  const filesInVisitOrder: string[] = [];

  // Step 1: do a post-order traversal of the dependency tree
  const visit = (file: string) => {
    if (!imports.has(file)) {
      const importList = getImportsForFile(file, srcRoot);
      imports.set(file, importList);

      // Recursively traverse imports
      for (const imp of importList) {
        visit(imp);

        // Also build the reverse graph while we're at it
        if (!importers.has(imp)) {
          importers.set(imp, new Set());
        }
        importers.get(imp).add(file);
      }

      filesInVisitOrder.push(file);
    }
  };


  for (const file of files) {
    visit(file);
  }

  filesInVisitOrder.reverse();

  const fileToRoot = new Map<string, string>();
  const rootToFiles = new Map<string, string[]>();

  // Step 2: traverse the graph again, but in the reverse direction
  // This groups files into strongly connected-components using information
  // obtained in step 1.
  const assign = (file: string, root: string) => {
    if (!fileToRoot.has(file)) {
      fileToRoot.set(file, root);

      if (!rootToFiles.has(root)) {
        rootToFiles.set(root, []); // array is fine since each file gets visited at most once
      }
      rootToFiles.get(root).push(file);

      if (importers.has(file)) {
        for (const importer of importers.get(file)) {
          assign(importer, root);
        }
      }
    }
  };

  for (const file of filesInVisitOrder) {
    assign(file, file);
  }

  return Array.from(rootToFiles.values());
}
