/* eslint-disable quotes */
/* eslint-disable indent */
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

export function normalizeTsconfigPath(tsconfigPath: string) {
  return path.resolve(tsconfigPath);
}

/**
 * Given a file, return the list of files it imports as absolute paths.
 */
export function getImportsForFile(file: string, srcRoot: string) {
  // Follow symlink so directory check works.
  file = fs.realpathSync(file);

  if (fs.lstatSync(file).isDirectory()) {
    const indexTs = path.join(file, "index.ts");
    if (fs.existsSync(indexTs)) {
      // https://basarat.gitbooks.io/typescript/docs/tips/barrel.html
      console.warn(`Warning: Barrel import: ${path.relative(srcRoot, file)}`);
      file = indexTs;
    }

    const indexTsx = path.join(file, "index.tsx");
    if (fs.existsSync(indexTsx)) {
      // https://basarat.gitbooks.io/typescript/docs/tips/barrel.html
      console.warn(`Warning: Barrel import: ${path.relative(srcRoot, file)}`);
      file = indexTsx;
    }

    if (!fs.existsSync(indexTs) && !fs.existsSync(indexTsx)) {
      throw new Error(`Warning: Importing a directory without an index.ts file: ${path.relative(srcRoot, file)}`);
    }
  }


  const fileInfo = ts.preProcessFile(fs.readFileSync(file).toString());
  return fileInfo.importedFiles
    .map(importedFile => importedFile.fileName)
    // remove svg, css imports
    .filter(fileName => !fileName.endsWith(".css") && !fileName.endsWith(".svg") && !fileName.endsWith(".json"))
    .filter(fileName => !fileName.endsWith(".png") && !fileName.endsWith(".jpg"))
    .filter(fileName => !fileName.endsWith(".js") && !fileName.endsWith(".jsx")) // Assume .js/.jsx imports have a .d.ts available
    .filter(x => /\//.test(x)) // remove node modules (the import must contain '/')
    .filter(x => !x.includes("lodash"))
    .filter(x => !x.includes("node_modules/"))
    .map(fileName => {
      if (fileName.includes("@saleor/app-bridge")) {
        return fileName;
      }
      if (fileName.includes("@saleor/macaw-ui")) {
        return fileName;
      }
      if (fileName.includes("@saleor/sdk")) {
        return fileName;
      }
      if (fileName.includes("@saleor")) {
        return fileName.replace("@saleor", "");
      }

      return fileName;
    })
    .map(fileName => {
      if (fileName.includes("@assets/")) {
        return path.join(srcRoot, fileName.replace("@assets", "./assets"));
      }
      if (fileName.includes("@locale/")) {
        return path.join(srcRoot, fileName.replace("@locale", "./locale"));
      }
      if (fileName.includes("@test/")) {
        return path.join(srcRoot, fileName.replace("@test", "../testUtils"));
      }
      if (/(^\.\/)|(^\.\.\/)/.test(fileName)) {
        return path.join(path.dirname(file), fileName);
      }

      return path.join(srcRoot, fileName);
    })
    .filter(x => !(/@/.test(x)))
    .map(fileName => {
      if (fs.existsSync(`${fileName}.ts`)) {
        return `${fileName}.ts`;
      }
      if (fs.existsSync(`${fileName}.tsx`)) {
        return `${fileName}.tsx`;
      }
      if (fs.existsSync(`${fileName}.d.ts`)) {
        return `${fileName}.d.ts`;
      }
      if (fs.existsSync(`${fileName}`)) {
        return fileName;
      }
      console.warn(`Warning: Unresolved import ${path.relative(srcRoot, fileName)} ` +
        `in ${path.relative(srcRoot, file)}`);

      return null;
    }).filter(fileName => !!fileName);
}

/**
 * This class memoizes the list of imports for each file.
 */
export class ImportTracker {
  private imports = new Map<string, string[]>()

  constructor(private srcRoot: string) { }

  public getImports(file: string): string[] {
    if (this.imports.has(file)) {
      return this.imports.get(file);
    }
    const imports = getImportsForFile(file, this.srcRoot);
    this.imports.set(file, imports);
    return imports;
  }
}
