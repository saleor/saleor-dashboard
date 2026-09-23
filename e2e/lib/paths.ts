import fs from "node:fs";
import path from "node:path";

/**
 * Located by walking up from the working directory rather than from this module: the
 * orchestration scripts run as ES modules (Node's type stripping) while Playwright
 * transpiles the same files to CommonJS, and `import.meta` and `__dirname` are not both
 * available in both. The marker is the pnpm workspace file, which only the root has.
 */
const findRepoRoot = (): string => {
  let directory = process.cwd();

  for (;;) {
    if (fs.existsSync(path.join(directory, "pnpm-workspace.yaml"))) {
      return directory;
    }

    const parent = path.dirname(directory);

    if (parent === directory) {
      throw new Error(`no pnpm-workspace.yaml above ${process.cwd()} - run from the repository`);
    }

    directory = parent;
  }
};

export const repoRoot = findRepoRoot();

export const e2eRoot = path.join(repoRoot, "e2e");

export const e2ePath = (...segments: string[]): string => path.join(e2eRoot, ...segments);

export const repoPath = (...segments: string[]): string => path.join(repoRoot, ...segments);
