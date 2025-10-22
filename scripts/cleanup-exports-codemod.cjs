const path = require("path");
const fs = require("fs");
const { Project, SyntaxKind, Node } = require("ts-morph");

// Parse CLI arguments
const args = process.argv.slice(2);
const stageArg = args.find(arg => arg.startsWith("--stage="));
const requestedStage = stageArg ? stageArg.split("=")[1] : "all";

const STAGES = {
  CONVERT_EXPORTS: "convert-exports",
  UPDATE_IMPORTS: "update-imports",
  REMOVE_BARRELS: "remove-barrels",
  FLATTEN_FOLDERS: "flatten-folders",
};

const project = new Project({
  tsConfigFilePath: path.resolve(__dirname, "../tsconfig.json"),
});

const SOURCE_GLOBS = ["src/**/*.{ts,tsx,js,jsx}", "playwright/**/*.{ts,tsx,js,jsx}"];

console.log(`\n${"=".repeat(60)}`);
console.log(`Running stage: ${requestedStage}`);
console.log(`${"=".repeat(60)}\n`);

const sourceFiles = project.getSourceFiles(SOURCE_GLOBS);

console.log(`Found ${sourceFiles.length} source files to process`);

const defaultExportNameByPath = new Map();

function toPascalCase(value) {
  return value
    .replace(/[^A-Za-z0-9]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function ensureValidIdentifier(text) {
  if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(text)) {
    return `Identifier${text.replace(/[^A-Za-z0-9_$]/g, "")}`;
  }
  return text;
}

function getFallbackName(sourceFile) {
  const filePath = sourceFile.getFilePath();
  const base = path.basename(filePath, path.extname(filePath));
  const directoryName = path.basename(path.dirname(filePath));
  const candidate = base.toLowerCase() === "index" ? directoryName : base;
  const pascal = toPascalCase(candidate) || "ExportedValue";
  return ensureValidIdentifier(pascal);
}

function isNameInUse(sourceFile, name) {
  return sourceFile
    .getDescendantsOfKind(SyntaxKind.Identifier)
    .some(identifier => identifier.getText() === name);
}

function getUniqueName(sourceFile, baseName) {
  let candidate = baseName;
  let counter = 1;
  while (isNameInUse(sourceFile, candidate)) {
    candidate = `${baseName}${counter}`;
    counter += 1;
  }
  return candidate;
}

function convertDefaultDeclaration(sourceFile, declaration) {
  if (Node.isFunctionDeclaration(declaration)) {
    let name = declaration.getName();
    if (!name) {
      name = getUniqueName(sourceFile, getFallbackName(sourceFile));
      declaration.setName(name);
    }
    declaration.setIsDefaultExport(false);
    declaration.setIsExported(true);
    return name;
  }

  if (Node.isClassDeclaration(declaration)) {
    let name = declaration.getName();
    if (!name) {
      name = getUniqueName(sourceFile, getFallbackName(sourceFile));
      declaration.setName(name);
    }
    declaration.setIsDefaultExport(false);
    declaration.setIsExported(true);
    return name;
  }

  if (Node.isInterfaceDeclaration(declaration)) {
    let name = declaration.getName();
    if (!name) {
      name = getUniqueName(sourceFile, getFallbackName(sourceFile));
      declaration.setName(name);
    }
    declaration.setIsDefaultExport(false);
    declaration.setIsExported(true);
    return name;
  }

  if (Node.isEnumDeclaration(declaration)) {
    let name = declaration.getName();
    if (!name) {
      name = getUniqueName(sourceFile, getFallbackName(sourceFile));
      declaration.setName(name);
    }
    declaration.setIsDefaultExport(false);
    declaration.setIsExported(true);
    return name;
  }

  if (Node.isExportAssignment(declaration)) {
    const expression = declaration.getExpression();
    if (!expression) {
      return null;
    }

    if (Node.isIdentifier(expression)) {
      const identifierName = expression.getText();
      declaration.replaceWithText(`export { ${identifierName} };`);
      return identifierName;
    }

    const fallback = getUniqueName(sourceFile, getFallbackName(sourceFile));
    const initializerText = expression.getText();
    declaration.replaceWithText(`export const ${fallback} = ${initializerText};`);
    return fallback;
  }

  return null;
}

function ensureDefaultExportName(sourceFile, stack = new Set()) {
  const filePath = sourceFile.getFilePath();
  if (defaultExportNameByPath.has(filePath)) {
    return defaultExportNameByPath.get(filePath);
  }

  if (stack.has(filePath)) {
    defaultExportNameByPath.set(filePath, null);
    return null;
  }

  stack.add(filePath);

  const defaultSymbol = sourceFile.getDefaultExportSymbol();
  if (defaultSymbol) {
    const declarations = defaultSymbol.getDeclarations();
    for (const declaration of declarations) {
      const exportName = convertDefaultDeclaration(sourceFile, declaration);
      if (exportName) {
        defaultExportNameByPath.set(filePath, exportName);
        stack.delete(filePath);
        return exportName;
      }
    }
  }

  for (const exportDeclaration of sourceFile.getExportDeclarations()) {
    for (const specifier of exportDeclaration.getNamedExports()) {
      const nameNode = specifier.getNameNode();
      if (!nameNode || nameNode.getText() !== "default") {
        continue;
      }
      const moduleSource = exportDeclaration.getModuleSpecifierSourceFile();
      if (!moduleSource) {
        continue;
      }
      const replacement = ensureDefaultExportName(moduleSource, stack);
      if (!replacement) {
        continue;
      }
      specifier.setName(replacement);
      defaultExportNameByPath.set(filePath, replacement);
      stack.delete(filePath);
      return replacement;
    }
  }

  defaultExportNameByPath.set(filePath, null);
  stack.delete(filePath);
  return null;
}

// Stage 1: Convert default exports to named exports
if (requestedStage === "all" || requestedStage === STAGES.CONVERT_EXPORTS) {
  console.log("\n[Stage 1/4] Converting default exports to named exports...");
  let convertedCount = 0;
  for (const sourceFile of sourceFiles) {
    const name = ensureDefaultExportName(sourceFile);
    if (name) {
      convertedCount++;
      if (convertedCount <= 5) {
        console.log(`  - ${sourceFile.getFilePath()}: ${name}`);
      }
    }
  }
  console.log(`Converted ${convertedCount} default exports`);

  console.log("Saving changes...");
  project.saveSync();
  console.log("✓ Stage 1 complete\n");

  if (requestedStage === STAGES.CONVERT_EXPORTS) process.exit(0);
}

// Stage 2: Update default imports to named imports
if (requestedStage === "all" || requestedStage === STAGES.UPDATE_IMPORTS) {
  console.log("[Stage 2/4] Updating default imports to named imports...");
  let updatedImportsCount = 0;
  for (const sourceFile of sourceFiles) {
    for (const importDeclaration of sourceFile.getImportDeclarations()) {
      const defaultImport = importDeclaration.getDefaultImport();
      if (!defaultImport) {
        continue;
      }
      const moduleSource = importDeclaration.getModuleSpecifierSourceFile();
      if (!moduleSource) {
        continue;
      }

      const exportedName = ensureDefaultExportName(moduleSource);
      if (!exportedName) {
        continue;
      }

      const localName = defaultImport.getText();
      importDeclaration.removeDefaultImport();
      updatedImportsCount++;

      const aliasNeeded = localName !== exportedName;
      const existingNamed = importDeclaration
        .getNamedImports()
        .map(named => named.getNameNode().getText());

      if (!existingNamed.includes(exportedName) || aliasNeeded) {
        importDeclaration.addNamedImport(
          aliasNeeded ? { name: exportedName, alias: localName } : exportedName,
        );
      }

      if (!importDeclaration.getNamedImports().length && !importDeclaration.getNamespaceImport()) {
        importDeclaration.remove();
      }
    }
  }
  console.log(`Updated ${updatedImportsCount} default imports`);

  console.log("Saving changes...");
  project.saveSync();
  console.log("✓ Stage 2 complete\n");

  if (requestedStage === STAGES.UPDATE_IMPORTS) process.exit(0);
}

// Stage 3: Flatten single-file component folders
if (requestedStage === "all" || requestedStage === STAGES.FLATTEN_FOLDERS) {
  console.log("[Stage 3/4] Flattening single-file component folders...");

  const srcPath = path.resolve(__dirname, "../src");
  const foldersToFlatten = [];

  // Find all directories in src/
  function findComponentFolders(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const fullPath = path.join(dir, entry.name);
      const dirContents = fs.readdirSync(fullPath);

      // Check if this folder only has:
      // - One component file (same name as folder)
      // - Optionally an index barrel file
      const componentName = entry.name;
      const possibleExtensions = [".tsx", ".ts", ".jsx", ".js"];

      let componentFile = null;
      let hasIndexBarrel = false;
      let otherFiles = [];

      for (const file of dirContents) {
        if (file.match(/^index\.(ts|tsx|js|jsx)$/)) {
          hasIndexBarrel = true;
        } else if (possibleExtensions.some(ext => file === componentName + ext)) {
          componentFile = file;
        } else {
          otherFiles.push(file);
        }
      }

      // If folder only contains component file (+ optional index), flatten it
      if (componentFile && otherFiles.length === 0) {
        foldersToFlatten.push({
          folderPath: fullPath,
          componentFile,
          hasIndexBarrel,
          parentDir: dir,
        });
      }

      // Recurse into subdirectories
      findComponentFolders(fullPath);
    }
  }

  findComponentFolders(srcPath);

  console.log(`Found ${foldersToFlatten.length} single-file component folders to flatten`);

  if (foldersToFlatten.length > 0) {
    console.log("\nFlattening folders:");
    for (const { folderPath, componentFile, hasIndexBarrel, parentDir } of foldersToFlatten) {
      const componentPath = path.join(folderPath, componentFile);
      const newPath = path.join(parentDir, componentFile);

      console.log(`  - ${path.relative(srcPath, folderPath)} → ${path.relative(srcPath, newPath)}`);

      // Move the component file to parent directory
      fs.renameSync(componentPath, newPath);

      // Delete index file if it exists
      if (hasIndexBarrel) {
        const indexFiles = fs
          .readdirSync(folderPath)
          .filter(f => f.match(/^index\.(ts|tsx|js|jsx)$/));
        indexFiles.forEach(indexFile => {
          fs.unlinkSync(path.join(folderPath, indexFile));
        });
      }

      // Remove the now-empty folder
      fs.rmdirSync(folderPath);
    }

    console.log(`\n✓ Flattened ${foldersToFlatten.length} folders`);
  }

  console.log("✓ Stage 3 complete\n");

  if (requestedStage === STAGES.FLATTEN_FOLDERS) process.exit(0);
}

function isBarrelFile(sourceFile) {
  // Only treat index.* files as barrel files
  const fileName = path.basename(sourceFile.getFilePath());
  const filePath = sourceFile.getFilePath();

  // Exclude graphql barrel file - we want to keep it
  if (filePath.includes("src/graphql/index.ts")) {
    return false;
  }

  if (!fileName.match(/^index\.(ts|tsx|js|jsx)$/)) {
    return false;
  }

  const statements = sourceFile.getStatements();
  if (!statements.length) {
    return false;
  }

  // Check if file has re-exports from project files
  const exportDeclarations = sourceFile.getExportDeclarations();
  const hasReExportsFromProject = exportDeclarations.some(
    exportDecl => exportDecl.getModuleSpecifierSourceFile() !== undefined,
  );

  // Must only contain imports and exports
  const onlyImportsAndExports = statements.every(
    statement => Node.isExportDeclaration(statement) || Node.isImportDeclaration(statement),
  );

  if (!onlyImportsAndExports) {
    if (hasReExportsFromProject) {
      console.warn(`⚠️  Warning: ${filePath}`);
      console.warn(`   File contains both actual code AND re-exports from project files.`);
      console.warn(
        `   Move the component/code to a separate file and keep only re-exports in index.*`,
      );
      console.warn(`   or remove all re-exports and keep only the component.\n`);
    } else {
      console.warn(`⚠️  Warning: ${filePath}`);
      console.warn(`   File is named 'index.*' but contains code beyond imports/exports.`);
      console.warn(`   This file should be manually reviewed and refactored.\n`);
    }
    return false;
  }

  // Check if all exports are from external packages (not source files in project)
  if (exportDeclarations.length === 0) {
    return false;
  }

  const allExportsAreExternal = exportDeclarations.every(
    exportDecl => !exportDecl.getModuleSpecifierSourceFile(),
  );

  // Don't treat external re-exports as barrel files
  if (allExportsAreExternal) {
    console.warn(`⚠️  Warning: ${filePath}`);
    console.warn(`   File only re-exports from external packages.`);
    console.warn(`   Consider importing directly from the package instead.\n`);
  }

  return !allExportsAreExternal;
}

function buildBarrelMapping(barrelFile) {
  const mapping = new Map();
  for (const exportDeclaration of barrelFile.getExportDeclarations()) {
    const moduleSource = exportDeclaration.getModuleSpecifierSourceFile();
    if (!moduleSource) {
      continue;
    }
    const modulePath = moduleSource.getFilePath();

    if (exportDeclaration.isNamespaceExport()) {
      const exportedDeclarations = moduleSource.getExportedDeclarations();
      for (const [exportedName] of exportedDeclarations) {
        if (exportedName === "default") {
          continue;
        }
        mapping.set(exportedName, {
          modulePath,
          importName: exportedName,
        });
      }
      continue;
    }

    for (const specifier of exportDeclaration.getNamedExports()) {
      const exportName = specifier.getAliasNode()
        ? specifier.getAliasNode().getText()
        : specifier.getName();
      const importName = specifier.getName();
      mapping.set(exportName, {
        modulePath,
        importName,
      });
    }
  }
  return mapping;
}

// Stage 4: Remove barrel files
if (requestedStage === "all" || requestedStage === STAGES.REMOVE_BARRELS) {
  console.log("[Stage 4/4] Removing barrel files...");

  // Process only index.* files automatically
  const barrelFiles = sourceFiles.filter(file => isBarrelFile(file));
  const barrelPaths = new Set(barrelFiles.map(f => f.getFilePath()));
  const nonBarrelFiles = sourceFiles.filter(f => !barrelPaths.has(f.getFilePath()));

  console.log(`Found ${barrelFiles.length} index.* barrel files to remove automatically\n`);

  // Build mappings for all barrels upfront
  console.log("Building barrel mappings...");
  const barrelMappings = new Map();
  const skippedBarrels = [];

  for (const barrel of barrelFiles) {
    const barrelPath = barrel.getFilePath();
    try {
      const mapping = buildBarrelMapping(barrel);
      barrelMappings.set(barrelPath, mapping);
    } catch (error) {
      if (
        error instanceof RangeError &&
        error.message.includes("Maximum call stack size exceeded")
      ) {
        console.warn(`⚠️  Skipping ${barrelPath} - circular dependency detected`);
        skippedBarrels.push(barrelPath);
      } else {
        throw error;
      }
    }
  }

  console.log(
    `✓ Mappings built (${barrelMappings.size} successful, ${skippedBarrels.length} skipped due to circular deps)\n`,
  );

  if (skippedBarrels.length > 0) {
    console.log("Files with circular dependencies (must be fixed manually):");
    skippedBarrels.forEach(p => console.log(`  - ${p}`));
    console.log();
  }

  // Process ALL files (including other barrels), checking if they import from any barrel
  console.log("Updating imports in all files (including other barrels)...");
  let processedFiles = 0;
  const filesWithNamespaceImports = [];

  for (const sourceFile of sourceFiles) {
    const filePath = sourceFile.getFilePath();

    // Skip the barrel file itself
    if (barrelPaths.has(filePath)) {
      continue;
    }

    // Skip generated files
    if (filePath.includes(".generated.") || filePath.includes("/__generated__/")) {
      continue;
    }

    processedFiles++;
    if (processedFiles % 500 === 0) {
      console.log(`  Processed ${processedFiles}/${nonBarrelFiles.length} files...`);
    }

    for (const importDeclaration of sourceFile.getImportDeclarations()) {
      const moduleSource = importDeclaration.getModuleSpecifierSourceFile();
      if (!moduleSource) {
        continue;
      }

      const barrelPath = moduleSource.getFilePath();
      const mapping = barrelMappings.get(barrelPath);

      if (!mapping) {
        continue; // Not importing from a barrel
      }

      const namedImports = importDeclaration.getNamedImports();
      const namespaceImport = importDeclaration.getNamespaceImport();
      if (namespaceImport) {
        // Can't automatically transform namespace imports, skip this import
        filesWithNamespaceImports.push({
          file: filePath,
          barrel: barrelPath,
        });
        continue;
      }

      const newImportsByModule = new Map();

      for (const namedImport of namedImports) {
        const exportedName = namedImport.getNameNode().getText();
        const aliasNode = namedImport.getAliasNode();
        const alias = aliasNode ? aliasNode.getText() : null;

        const target = mapping.get(exportedName);
        if (!target) {
          throw new Error(`Unable to resolve export ${exportedName} from barrel ${barrelPath}`);
        }

        if (!newImportsByModule.has(target.modulePath)) {
          newImportsByModule.set(target.modulePath, []);
        }

        newImportsByModule.get(target.modulePath).push({
          importName: target.importName,
          alias,
        });
      }

      importDeclaration.remove();

      for (const [modulePath, specifiers] of newImportsByModule) {
        const relativePath = path.relative(path.dirname(sourceFile.getFilePath()), modulePath);
        const normalizedPath = relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
        const cleanedPath = normalizedPath.split("\\").join("/");

        const moduleSpecifier = cleanedPath.replace(/\.(tsx?|jsx?)$/, "");
        sourceFile.addImportDeclaration({
          moduleSpecifier,
          namedImports: specifiers.map(specifier =>
            specifier.alias && specifier.alias !== specifier.importName
              ? { name: specifier.importName, alias: specifier.alias }
              : specifier.importName,
          ),
        });
      }
    }
  }
  console.log(`✓ Updated imports in ${processedFiles} files\n`);

  if (filesWithNamespaceImports.length > 0) {
    console.log("Files with namespace imports from barrels (must be fixed manually):");
    filesWithNamespaceImports.forEach(({ file, barrel }) =>
      console.log(`  - ${file} imports from ${barrel}`),
    );
    console.log();
  }

  // Don't delete barrels that still have namespace imports
  const barrelsWithNamespaceImports = new Set(
    filesWithNamespaceImports.map(({ barrel }) => barrel),
  );
  barrelsWithNamespaceImports.forEach(barrel => {
    if (!skippedBarrels.includes(barrel)) {
      skippedBarrels.push(barrel);
    }
  });

  // Delete barrel files (except skipped ones)
  console.log("Deleting barrel files...");
  const skippedBarrelsSet = new Set(skippedBarrels);
  let deletedCount = 0;
  for (const barrel of barrelFiles) {
    const filePath = barrel.getFilePath();
    if (skippedBarrelsSet.has(filePath)) {
      continue; // Don't delete barrels with circular deps
    }
    barrel.delete();
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    deletedCount++;
  }
  console.log(
    `✓ Deleted ${deletedCount} barrel files (${skippedBarrels.length} kept due to circular deps)\n`,
  );

  console.log("Saving changes...");
  project.saveSync();
  console.log("✓ Barrel files removed\n");

  // Now scan remaining non-index files for warnings
  console.log("Scanning non-index files for mixed code and re-exports...\n");
  let warningCount = 0;
  for (const sourceFile of nonBarrelFiles) {
    const filePath = sourceFile.getFilePath();
    const statements = sourceFile.getStatements();
    if (!statements.length) continue;

    const hasCode = statements.some(
      statement => !Node.isExportDeclaration(statement) && !Node.isImportDeclaration(statement),
    );

    const exportDeclarations = sourceFile.getExportDeclarations();
    const hasReExportsFromProject = exportDeclarations.some(
      exportDecl => exportDecl.getModuleSpecifierSourceFile() !== undefined,
    );

    if (hasCode && hasReExportsFromProject) {
      warningCount++;
      console.warn(`⚠️  Warning: ${filePath}`);
      console.warn(`   File contains both code AND re-exports from project files.`);
      console.warn(`   Consider removing re-exports and importing directly from source files.\n`);
    }
  }

  if (warningCount > 0) {
    console.log(
      `\nFound ${warningCount} non-index files with mixed code and re-exports that need manual review.`,
    );
  } else {
    console.log(`\nNo non-index files with mixed code and re-exports found.`);
  }

  console.log("\n✓ Stage 4 complete\n");
}

console.log("\n" + "=".repeat(60));
console.log("✓ All stages complete!");
console.log("=".repeat(60));
