#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Mapping of enum type names to their constant array names
const enumToConstantMap = {
  CollectionPublished: 'CollectionPublishedValues',
  CountryCode: 'CountryCodeValues',
  AttributeTypeEnum: 'AttributeTypeEnumValues',
  OrderStatus: 'OrderStatusValues',
  OrderChargeStatusEnum: 'OrderChargeStatusEnumValues',
  FulfillmentStatus: 'FulfillmentStatusValues',
  OrderAuthorizeStatusEnum: 'OrderAuthorizeStatusEnumValues',
  PaymentMethodTypeEnum: 'PaymentMethodTypeEnumValues',
  ProductTypeEnum: 'ProductTypeEnumValues',
  StaffMemberStatus: 'StaffMemberStatusValues',
  VoucherDiscountType: 'VoucherDiscountTypeValues',
  DiscountStatusEnum: 'DiscountStatusEnumValues',
  DiscountValueTypeEnum: 'DiscountValueTypeEnumValues',
  WebhookEventTypeAsyncEnum: 'WebhookEventTypeAsyncEnumValues',
  WebhookEventTypeSyncEnum: 'WebhookEventTypeSyncEnumValues',
  PermissionEnum: 'PermissionEnumValues',
  ProductAttributeType: 'ProductAttributeTypeValues',
  AttributeInputTypeEnum: 'AttributeInputTypeEnumValues',
};

const getFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!['node_modules', '.git', 'dist', 'build'].includes(file)) {
        getFiles(filePath, fileList);
      }
    } else if (filePath.match(/\.(ts|tsx)$/) && !filePath.includes('.generated.') && !filePath.includes('enumConstants.ts')) {
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
  let importsNeeded = new Set();

  // Pattern 1: Object.values(EnumType) -> ConstantArray
  Object.entries(enumToConstantMap).forEach(([enumName, constantName]) => {
    const objectValuesPattern = new RegExp(`Object\\.values\\(${enumName}\\)`, 'g');
    if (objectValuesPattern.test(content)) {
      content = content.replace(objectValuesPattern, constantName);
      importsNeeded.add(constantName);
      modified = true;
      fileReplacements++;
    }
  });

  // Pattern 2: Object.keys(EnumType) -> ConstantArray (keys and values are the same for string enums)
  Object.entries(enumToConstantMap).forEach(([enumName, constantName]) => {
    const objectKeysPattern = new RegExp(`Object\\.keys\\(${enumName}\\)`, 'g');
    if (objectKeysPattern.test(content)) {
      content = content.replace(objectKeysPattern, constantName);
      importsNeeded.add(constantName);
      modified = true;
      fileReplacements++;
    }
  });

  if (modified && importsNeeded.size > 0) {
    // Add import statement if not already present
    const importStatement = `import { ${Array.from(importsNeeded).join(', ')} } from "@dashboard/graphql/enumConstants";\n`;

    // Find the last import statement
    const lines = content.split('\n');
    let lastImportIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        lastImportIndex = i;
      }
    }

    if (lastImportIndex !== -1) {
      lines.splice(lastImportIndex + 1, 0, importStatement.trim());
      content = lines.join('\n');
    } else {
      // No imports found, add at the beginning
      content = importStatement + content;
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    filesModified++;
    totalReplacements += fileReplacements;
    console.log(`✓ ${path.relative(process.cwd(), filePath)}: ${fileReplacements} replacements`);
  }
});

console.log('\n=== Fix Summary ===');
console.log(`Files modified: ${filesModified}`);
console.log(`Total replacements: ${totalReplacements}`);
console.log('Fixes complete!');
