import * as fs from "fs";
import glob from "glob";

function considerFile(file: string): boolean {
  return file.endsWith(".ts") || file.endsWith(".tsx");
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

export function forEachFileInTestUtils(srcRoot: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob(`${srcRoot}/../testUtils/**/*.ts?(x)`, (err, files) => {
      if (err) {
        return reject(err);
      }

      return resolve(files.filter(considerFile));
    });
  });
}

/**
 * This function returns the list of files that have already been excluded in
 * tsconfig.
 */
export async function getExcludedFiles(
  tsconfigPath: string
): Promise<Set<string>> {
  const configFileContent = JSON.parse(
    fs.readFileSync(tsconfigPath).toString()
  );

  return new Set<string>(new Set(configFileContent.exclude || []));
}
