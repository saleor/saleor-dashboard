#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read all enum type names from the generated types file
const enumTypes = fs.readFileSync('/tmp/enum_types.txt', 'utf-8')
  .split('\n')
  .filter(line => line.trim().length > 0);

console.log(`Found ${enumTypes.length} enum types to convert`);

// Get all TypeScript files in src directory, excluding generated files
const getFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and other non-source directories
      if (!['node_modules', '.git', 'dist', 'build'].includes(file)) {
        getFiles(filePath, fileList);
      }
    } else if (filePath.match(/\.(ts|tsx)$/) && !filePath.includes('.generated.')) {
      fileList.push(filePath);
    }
  });

  return fileList;
};

const files = getFiles(path.join(__dirname, '..', 'src'));
console.log(`Processing ${files.length} TypeScript files...`);

let totalReplacements = 0;
let filesModified = 0;

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  let fileReplacements = 0;

  enumTypes.forEach(enumType => {
    // Pattern: EnumType.ENUM_VALUE
    // We need to capture the ENUM_VALUE part and replace the whole thing with "ENUM_VALUE"
    // Use word boundary to avoid partial matches
    const pattern = new RegExp(`\\b${enumType}\\.([A-Z_][A-Z0-9_]*)\\b`, 'g');

    const newContent = content.replace(pattern, (match, enumValue) => {
      fileReplacements++;
      return `"${enumValue}"`;
    });

    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    filesModified++;
    totalReplacements += fileReplacements;
    console.log(`✓ ${path.relative(process.cwd(), filePath)}: ${fileReplacements} replacements`);
  }
});

console.log('\n=== Conversion Summary ===');
console.log(`Files modified: ${filesModified}`);
console.log(`Total replacements: ${totalReplacements}`);
console.log('Conversion complete!');
