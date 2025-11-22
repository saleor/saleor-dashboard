#!/usr/bin/env node

const fs = require('fs');

const content = fs.readFileSync('/home/user/saleor-dashboard/src/graphql/types.generated.ts', 'utf-8');

// Function to extract enum values from a type definition
function extractEnumValues(typeName) {
  const regex = new RegExp(`export type ${typeName} =([^;]+);`, 's');
  const match = content.match(regex);

  if (!match) {
    console.error(`Could not find type ${typeName}`);
    return null;
  }

  // Extract just the quoted values, ignoring comments
  const values = [];
  const lines = match[1].split('\n');

  for (const line of lines) {
    // Match quoted strings
    const quoted = line.match(/'([^']+)'/);
    if (quoted) {
      values.push(quoted[1]);
    }
  }

  return values;
}

// Extract only the enum types that we need
const enumsToExtract = [
  'CollectionPublished',
  'CountryCode',
  'AttributeTypeEnum',
  'OrderStatus',
  'OrderChargeStatusEnum',
  'FulfillmentStatus',
  'OrderAuthorizeStatusEnum',
  'PaymentMethodTypeEnum',
  'ProductTypeEnum',
  'StaffMemberStatus',
  'VoucherDiscountType',
  'DiscountStatusEnum',
  'DiscountValueTypeEnum',
  'WebhookEventTypeAsyncEnum',
  'WebhookEventTypeSyncEnum',
  'PermissionEnum',
  'ProductAttributeType',
  'AttributeInputTypeEnum',
  'StockAvailability',
  'WeightUnitsEnum',
  'LanguageCodeEnum',
  'ProductTypeConfigurable',
  'VariantAttributeScope',
];

const enums = {};
enumsToExtract.forEach(name => {
  enums[name] = extractEnumValues(name);
});

// Generate the file content
let output = `// This file provides runtime constants for GraphQL enum types
// that have been converted from TypeScript enums to type literals.
// These constants are needed when enum values need to be used at runtime
// (e.g., Object.values(), Object.keys(), iteration, etc.)

import type {
  AttributeInputTypeEnum,
  AttributeTypeEnum,
  CollectionPublished,
  CountryCode,
  DiscountStatusEnum,
  DiscountValueTypeEnum,
  FulfillmentStatus,
  LanguageCodeEnum,
  OrderAuthorizeStatusEnum,
  OrderChargeStatusEnum,
  OrderStatus,
  PaymentMethodTypeEnum,
  PermissionEnum,
  ProductAttributeType,
  ProductTypeConfigurable,
  ProductTypeEnum,
  StaffMemberStatus,
  StockAvailability,
  VariantAttributeScope,
  VoucherDiscountType,
  WeightUnitsEnum,
  WebhookEventTypeAsyncEnum,
  WebhookEventTypeSyncEnum,
} from "./types.generated";

`;

// Helper function to format array values
function formatArray(values, perLine = 5) {
  const chunks = [];
  for (let i = 0; i < values.length; i += perLine) {
    chunks.push(values.slice(i, i + perLine).map(v => `"${v}"`).join(', '));
  }
  return chunks.join(',\n  ');
}

// Generate each constant
output += `// Collection Published\nexport const CollectionPublishedValues: CollectionPublished[] = [\n  ${formatArray(enums.CollectionPublished)}\n];\n\n`;
output += `// Country Codes\nexport const CountryCodeValues: CountryCode[] = [\n  ${formatArray(enums.CountryCode, 10)}\n];\n\n`;
output += `// Attribute Type\nexport const AttributeTypeEnumValues: AttributeTypeEnum[] = [\n  ${formatArray(enums.AttributeTypeEnum)}\n];\n\n`;
output += `// Order Status\nexport const OrderStatusValues: OrderStatus[] = [\n  ${formatArray(enums.OrderStatus)}\n];\n\n`;
output += `// Order Charge Status\nexport const OrderChargeStatusEnumValues: OrderChargeStatusEnum[] = [\n  ${formatArray(enums.OrderChargeStatusEnum)}\n];\n\n`;
output += `// Fulfillment Status\nexport const FulfillmentStatusValues: FulfillmentStatus[] = [\n  ${formatArray(enums.FulfillmentStatus)}\n];\n\n`;
output += `// Order Authorize Status\nexport const OrderAuthorizeStatusEnumValues: OrderAuthorizeStatusEnum[] = [\n  ${formatArray(enums.OrderAuthorizeStatusEnum)}\n];\n\n`;
output += `// Payment Method Type\nexport const PaymentMethodTypeEnumValues: PaymentMethodTypeEnum[] = [\n  ${formatArray(enums.PaymentMethodTypeEnum)}\n];\n\n`;
output += `// Product Type\nexport const ProductTypeEnumValues: ProductTypeEnum[] = [\n  ${formatArray(enums.ProductTypeEnum)}\n];\n\n`;
output += `// Staff Member Status\nexport const StaffMemberStatusValues: StaffMemberStatus[] = [\n  ${formatArray(enums.StaffMemberStatus)}\n];\n\n`;
output += `// Voucher Discount Type\nexport const VoucherDiscountTypeValues: VoucherDiscountType[] = [\n  ${formatArray(enums.VoucherDiscountType)}\n];\n\n`;
output += `// Discount Status\nexport const DiscountStatusEnumValues: DiscountStatusEnum[] = [\n  ${formatArray(enums.DiscountStatusEnum)}\n];\n\n`;
output += `// Discount Value Type\nexport const DiscountValueTypeEnumValues: DiscountValueTypeEnum[] = [\n  ${formatArray(enums.DiscountValueTypeEnum)}\n];\n\n`;
output += `// Webhook Event Type Async\nexport const WebhookEventTypeAsyncEnumValues: WebhookEventTypeAsyncEnum[] = [\n  ${formatArray(enums.WebhookEventTypeAsyncEnum, 1)}\n];\n\n`;
output += `// Webhook Event Type Sync\nexport const WebhookEventTypeSyncEnumValues: WebhookEventTypeSyncEnum[] = [\n  ${formatArray(enums.WebhookEventTypeSyncEnum, 1)}\n];\n\n`;
output += `// Permission Enum\nexport const PermissionEnumValues: PermissionEnum[] = [\n  ${formatArray(enums.PermissionEnum, 3)}\n];\n\n`;
output += `// Product Attribute Type\nexport const ProductAttributeTypeValues: ProductAttributeType[] = [\n  ${formatArray(enums.ProductAttributeType)}\n];\n\n`;
output += `// Attribute Input Type\nexport const AttributeInputTypeEnumValues: AttributeInputTypeEnum[] = [\n  ${formatArray(enums.AttributeInputTypeEnum)}\n];\n\n`;
output += `// Stock Availability\nexport const StockAvailabilityValues: StockAvailability[] = [\n  ${formatArray(enums.StockAvailability)}\n];\n\n`;
output += `// Weight Units\nexport const WeightUnitsEnumValues: WeightUnitsEnum[] = [\n  ${formatArray(enums.WeightUnitsEnum)}\n];\n\n`;
output += `// Language Codes\nexport const LanguageCodeEnumValues: LanguageCodeEnum[] = [\n  ${formatArray(enums.LanguageCodeEnum, 10)}\n];\n\n`;
output += `// Product Type Configurable\nexport const ProductTypeConfigurableValues: ProductTypeConfigurable[] = [\n  ${formatArray(enums.ProductTypeConfigurable)}\n];\n\n`;
output += `// Variant Attribute Scope\nexport const VariantAttributeScopeValues: VariantAttributeScope[] = [\n  ${formatArray(enums.VariantAttributeScope)}\n];\n`;

fs.writeFileSync('/home/user/saleor-dashboard/src/graphql/enumConstants.ts', output);
console.log('Generated enumConstants.ts successfully!');
