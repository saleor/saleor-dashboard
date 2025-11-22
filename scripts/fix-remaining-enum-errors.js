#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files and their replacements
const fixes = [
  // Collections filters
  {
    file: 'src/collections/views/CollectionList/filters.ts',
    replacements: [
      {
        find: 'findValueInEnum(status, CollectionPublished)',
        replace: 'status as CollectionPublished',
      },
      {
        find: 'findValueInEnum(params.status, CollectionPublished)',
        replace: 'params.status as CollectionPublished',
      },
      {
        find: ', CollectionPublished,',
        replace: ',',
      },
    ],
    addImport: null,
  },
  // Address validation
  {
    file: 'src/components/AddressEdit/useAddressValidation.ts',
    replacements: [
      {
        find: /CountryCode,/g,
        replace: 'CountryCodeValues,',
      },
    ],
    addImport: 'import { CountryCodeValues } from "@dashboard/graphql/enumConstants";',
  },
  // Misc.ts - update the functions
  {
    file: 'src/misc.ts',
    replacements: [
      {
        find: 'findInEnum(address.country, CountryCode)',
        replace: 'address.country as CountryCode',
      },
      {
        find: 'findInEnum(data?.country?.code || "", CountryCode)',
        replace: '(data?.country?.code || "") as CountryCode',
      },
    ],
    addImport: null,
  },
  // Conditional filters - initial states
  {
    file: 'src/components/ConditionalFilter/API/initialState/attributes/useInitialAttributesState.ts',
    replacements: [
      {
        find: /AttributeTypeEnum,/g,
        replace: 'AttributeTypeEnumValues,',
      },
    ],
    addImport: 'import { AttributeTypeEnumValues } from "@dashboard/graphql/enumConstants";',
  },
  {
    file: 'src/components/ConditionalFilter/API/initialState/orders/useInitialOrderState.ts',
    replacements: [
      {
        find: /OrderChargeStatusEnum,/g,
        replace: 'OrderChargeStatusEnumValues,',
      },
      {
        find: /OrderStatus,/g,
        replace: 'OrderStatusValues,',
      },
      {
        find: /FulfillmentStatus,/g,
        replace: 'FulfillmentStatusValues,',
      },
      {
        find: /OrderAuthorizeStatusEnum,/g,
        replace: 'OrderAuthorizeStatusEnumValues,',
      },
      {
        find: /PaymentMethodTypeEnum,/g,
        replace: 'PaymentMethodTypeEnumValues,',
      },
      {
        find: /CountryCode,/g,
        replace: 'CountryCodeValues,',
      },
    ],
    addImport: 'import { OrderChargeStatusEnumValues, OrderStatusValues, FulfillmentStatusValues, OrderAuthorizeStatusEnumValues, PaymentMethodTypeEnumValues, CountryCodeValues } from "@dashboard/graphql/enumConstants";',
  },
  {
    file: 'src/components/ConditionalFilter/API/initialState/productTypes/useInitialProdutTypesState.ts',
    replacements: [
      {
        find: /ProductTypeEnum,/g,
        replace: 'ProductTypeEnumValues,',
      },
    ],
    addImport: 'import { ProductTypeEnumValues } from "@dashboard/graphql/enumConstants";',
  },
  {
    file: 'src/components/ConditionalFilter/API/initialState/staffMembers/useInitialStaffMemebersState.ts',
    replacements: [
      {
        find: /StaffMemberStatus,/g,
        replace: 'StaffMemberStatusValues,',
      },
    ],
    addImport: 'import { StaffMemberStatusValues } from "@dashboard/graphql/enumConstants";',
  },
  {
    file: 'src/components/ConditionalFilter/API/initialState/vouchers/useInitialVouchersState.ts',
    replacements: [
      {
        find: /VoucherDiscountType,/g,
        replace: 'VoucherDiscountTypeValues,',
      },
      {
        find: /DiscountStatusEnum,/g,
        replace: 'DiscountStatusEnumValues,',
      },
    ],
    addImport: 'import { VoucherDiscountTypeValues, DiscountStatusEnumValues } from "@dashboard/graphql/enumConstants";',
  },
  // Conditional filters - providers
  {
    file: 'src/components/ConditionalFilter/API/providers/AttributesFilterAPIProvider.tsx',
    replacements: [
      {
        find: /AttributeTypeEnum,/g,
        replace: 'AttributeTypeEnumValues,',
      },
    ],
    addImport: 'import { AttributeTypeEnumValues } from "@dashboard/graphql/enumConstants";',
  },
  {
    file: 'src/components/ConditionalFilter/API/providers/OrderFilterAPIProvider.tsx',
    replacements: [
      {
        find: /OrderStatus,/g,
        replace: 'OrderStatusValues,',
      },
      {
        find: /OrderAuthorizeStatusEnum,/g,
        replace: 'OrderAuthorizeStatusEnumValues,',
      },
      {
        find: /OrderChargeStatusEnum,/g,
        replace: 'OrderChargeStatusEnumValues,',
      },
      {
        find: /FulfillmentStatus,/g,
        replace: 'FulfillmentStatusValues,',
      },
      {
        find: /PaymentMethodTypeEnum,/g,
        replace: 'PaymentMethodTypeEnumValues,',
      },
      {
        find: /CountryCode,/g,
        replace: 'CountryCodeValues,',
      },
    ],
    addImport: 'import { OrderStatusValues, OrderAuthorizeStatusEnumValues, OrderChargeStatusEnumValues, FulfillmentStatusValues, PaymentMethodTypeEnumValues, CountryCodeValues } from "@dashboard/graphql/enumConstants";',
  },
  {
    file: 'src/components/ConditionalFilter/API/providers/ProductTypesFilterAPIProvider.tsx',
    replacements: [
      {
        find: /ProductTypeEnum,/g,
        replace: 'ProductTypeEnumValues,',
      },
    ],
    addImport: 'import { ProductTypeEnumValues } from "@dashboard/graphql/enumConstants";',
  },
  {
    file: 'src/components/ConditionalFilter/API/providers/StaffMembersFilterAPIProvider.tsx',
    replacements: [
      {
        find: /StaffMemberStatus,/g,
        replace: 'StaffMemberStatusValues,',
      },
    ],
    addImport: 'import { StaffMemberStatusValues } from "@dashboard/graphql/enumConstants";',
  },
  {
    file: 'src/components/ConditionalFilter/API/providers/VoucherFilterAPIProvider.ts',
    replacements: [
      {
        find: /VoucherDiscountType,/g,
        replace: 'VoucherDiscountTypeValues,',
      },
      {
        find: /DiscountStatusEnum,/g,
        replace: 'DiscountStatusEnumValues,',
      },
    ],
    addImport: 'import { VoucherDiscountTypeValues, DiscountStatusEnumValues } from "@dashboard/graphql/enumConstants";',
  },
  // Discount filters
  {
    file: 'src/discounts/views/SaleList/filters.ts',
    replacements: [
      {
        find: ', DiscountValueTypeEnum,',
        replace: ',',
      },
      {
        find: ', DiscountStatusEnum,',
        replace: ',',
      },
    ],
    addImport: null,
  },
  {
    file: 'src/discounts/views/VoucherList/filters.ts',
    replacements: [
      {
        find: ', VoucherDiscountType,',
        replace: ',',
      },
      {
        find: ', DiscountStatusEnum,',
        replace: ',',
      },
    ],
    addImport: null,
  },
  // Orders
  {
    file: 'src/orders/utils/data.ts',
    replacements: [
      {
        find: /CountryCode,/g,
        replace: 'CountryCodeValues,',
      },
    ],
    addImport: 'import { CountryCodeValues } from "@dashboard/graphql/enumConstants";',
  },
  {
    file: 'src/orders/views/OrderList/filters.ts',
    replacements: [
      {
        find: ', OrderStatus,',
        replace: ',',
      },
      {
        find: ', OrderChargeStatusEnum,',
        replace: ',',
      },
      {
        find: ', OrderAuthorizeStatusEnum,',
        replace: ',',
      },
    ],
    addImport: null,
  },
  // Product Types
  {
    file: 'src/productTypes/components/ProductTypeAttributes/ProductTypeAttributes.tsx',
    replacements: [
      {
        find: /ProductAttributeType,/g,
        replace: 'ProductAttributeTypeValues,',
      },
    ],
    addImport: 'import { ProductAttributeTypeValues } from "@dashboard/graphql/enumConstants";',
  },
  {
    file: 'src/productTypes/components/ProductTypeVariantAttributes/ProductTypeVariantAttributes.tsx',
    replacements: [
      {
        find: /ProductAttributeType,/g,
        replace: 'ProductAttributeTypeValues,',
      },
    ],
    addImport: 'import { ProductAttributeTypeValues } from "@dashboard/graphql/enumConstants";',
  },
  // Model Types
  {
    file: 'src/modelTypes/components/PageTypeAttributes/PageTypeAttributes.tsx',
    replacements: [
      {
        find: /AttributeTypeEnum,/g,
        replace: 'AttributeTypeEnumValues,',
      },
    ],
    addImport: 'import { AttributeTypeEnumValues } from "@dashboard/graphql/enumConstants";',
  },
  // Customer filters
  {
    file: 'src/customers/components/CustomerListPage/filters.ts',
    replacements: [
      {
        find: 'permissions: ["MANAGE_ORDERS" as PermissionEnum],',
        replace: 'permissions: ["MANAGE_ORDERS"],',
      },
      {
        find: 'hasPermission(["MANAGE_ORDERS" as PermissionEnum], user),',
        replace: 'hasPermission(["MANAGE_ORDERS"], user),',
      },
    ],
    addImport: null,
  },
];

console.log('Applying targeted fixes...');
let filesModified = 0;

fixes.forEach(({ file, replacements, addImport }) => {
  const filePath = path.join(__dirname, '..', file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠ Skipping ${file} (file not found)`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  replacements.forEach(({ find, replace }) => {
    if (typeof find === 'string') {
      if (content.includes(find)) {
        content = content.replace(new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
        modified = true;
      }
    } else {
      // It's a RegExp
      if (find.test(content)) {
        content = content.replace(find, replace);
        modified = true;
      }
    }
  });

  if (modified && addImport) {
    // Add import if not already present
    if (!content.includes(addImport.split(' from ')[1])) {
      const lines = content.split('\n');
      let lastImportIndex = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('import ')) {
          lastImportIndex = i;
        }
      }

      if (lastImportIndex !== -1) {
        lines.splice(lastImportIndex + 1, 0, addImport);
        content = lines.join('\n');
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    filesModified++;
    console.log(`✓ Fixed ${file}`);
  }
});

console.log(`\n=== Fix Summary ===`);
console.log(`Files modified: ${filesModified}`);
console.log('Targeted fixes complete!');
