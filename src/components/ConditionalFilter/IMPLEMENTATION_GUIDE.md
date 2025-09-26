# ConditionalFilter Implementation Guide

This guide provides detailed instructions for adding new filter fields and avoiding common pitfalls.

## Overview

The ConditionalFilter system is complex with many interconnected parts. This guide will help you navigate the common pitfalls and ensure your new fields work correctly.

**📋 For high-level architecture, see [AGENTS.md](./AGENTS.md)**, [README.md](../../../README.md) and [Saleor Docs](https://docs.saleor.io)

## Common Pitfalls

### 1. Multi-digit Parsing Bug

**Problem**: UrlToken.getInfo() used `split("")` to parse condition indices, causing multi-digit indices to be truncated.

```javascript
// ❌ Wrong - splits "10" into ["1", "0"]
const type = identifier.split("")[0];
const control = parseInt(identifier.split("")[1], 10);

// ✅ Correct - handles multi-digit indices
const type = identifier.charAt(0) as TokenTypeValue;
const control = parseInt(identifier.slice(1), 10);
```

### 2. String Truncation in Field Parsing

**Problem**: `Condition.fromUrlToken` treated all values as arrays, truncating strings to first character.
**Solution**: Add special handling for price, numeric, and date fields to preserve string values.

### 3. Field Name Mapping Issues

**Problem**: Mapping `customer` → `user` for a specific view which used WHERE API broke other views using FILTER API.
**Solution**: Make mapping context-specific - only apply for specific views (see `OrderIdQueryVarsBuilder.ts`)

### 4. Missing Field Registration

**Problem**: Fields not added to STATICS arrays don't persist in URL.
**Solution**: Always add new fields to appropriate `*_STATICS` array in `UrlToken.ts`.

### 5. Handler Missing Errors

**Problem**: "Unknown filter element" errors when handlers not defined.
**Solution**: Add handler for every new field in the list view `FilterAPIProvider`.

### 6. RangeInput UI Crashes

**Problem**: Numeric fields returning integers crash `RangeInput` component expecting strings.
**Solution**: Add numeric fields to `isNumericField` checks to preserve string format.

### 7. Inappropriate Constraint Options

**Problem**: "in" option on single-value fields confuses users and breaks functionality.
**Solution**: Remove multiselect options from text/number input fields.

### 8. Field Name Consistency Across Files

**Problem**: Field names must be exactly the same across multiple files, but inconsistencies can cause persistence failures.
**Example**: Gift card fields defined as `"isGiftCardBought"` in constants.ts but `"giftCardBought"` in UrlToken.ts.
**Solution**: Ensure field names match exactly across all relevant files.

### 9. Enum API Mismatch Between FILTER and WHERE APIs

**Problem**: Using legacy FILTER API enums for WHERE API causes GraphQL validation errors.
**Example**: `OrderStatusFilter` includes "READY_TO_CAPTURE" and "READY_TO_FULFILL" but `OrderStatus` (for WHERE API) doesn't.
**Solution**: Use the correct enum type for your API - `OrderStatus` for WHERE API, not `OrderStatusFilter`.

## Complete Checklist for Adding New Filter Fields

### Step 1: Define the Field Structure

**File**: `constants.ts`

1. Add field to `STATIC_*_OPTIONS` array:

```typescript
{
  value: "fieldName",
  label: "Display Name",
  type: "fieldName",
  slug: "fieldName",
}
```

2. Define constraints in `STATIC_CONDITIONS`:

```typescript
fieldName: [
  { type: "text", label: "is", value: "input-1" },
  // ❌ Don't add "in" for single-value fields
  // { type: "multiselect", label: "in", value: "input-2" },
  { type: "text", label: "contains", value: "input-3" },
],
```

**Field Type Guidelines**:

- Text fields: `text` type, "is", "contains" constraints
- Integer fields: `number` type, "is", "lower", "greater", "between" constraints
- Boolean fields: `select` type, "is" constraint only
- Date fields: `datetime`/`date` type, "lower", "greater", "between" constraints

### Step 2: Register for URL Persistence

**File**: `ValueProvider/UrlToken.ts`

Add field name to appropriate STATICS array:

```typescript
const ORDER_STATICS = [
  "status",
  "chargeStatus",
  // ... existing fields
  "yourNewField", // ← Add here
];
```

**⚠️ Critical**: Without this step, filter values won't persist when users reopen filters.

**⚠️ Important**: Field name must match EXACTLY with the name used in Step 1 (constants.ts). Any mismatch will cause persistence failures.

### Step 3: Add Data Handler

**File**: `API/providers/*FilterAPIProvider.tsx` (e.g., `OrderFilterAPIProvider.tsx`)

Add handler in `createAPIHandler` function:

```typescript
// Text/Number input fields
if (rowType === "yourNewField") {
  return new NoopValuesHandler([]);
}

// Boolean fields
if (rowType === "yourBooleanField") {
  return new BooleanValuesHandler([
    { label: "Yes", value: "true", type: AttributeInputTypeEnum.BOOLEAN, slug: "true" },
    { label: "No", value: "false", type: AttributeInputTypeEnum.BOOLEAN, slug: "false" },
  ]);
}

// Enum fields
if (rowType === "yourEnumField") {
  return new EnumValuesHandler(YourEnum, rowType, intl);
}
```

### Step 4: Update Fetching Parameters

**File**: `ValueProvider/TokenArray/fetchingParams.ts`

1. Add to interface:

```typescript
export interface OrderFetchingParams {
  status: string[];
  // ... existing fields
  yourNewField: string[];
}
```

2. Add to empty params:

```typescript
export const emptyOrderFetchingParams: OrderFetchingParams = {
  status: [],
  // ... existing fields
  yourNewField: [],
};
```

### Step 5: Handle Initial State

**File**: `API/initialState/*/InitialState.ts` and `use*State.ts`

1. Add to interface:

```typescript
export interface InitialOrderState {
  status: ItemOption[];
  // ... existing fields
  yourNewField: ItemOption[];
}
```

2. Update constructor:

```typescript
constructor(
  public status: ItemOption[] = [],
  // ... existing fields
  public yourNewField: ItemOption[] = [],
) {}
```

3. Add to `getEntryByName`:

```typescript
private getEntryByName(name: string): ItemOption[] {
  switch (name) {
    case "status":
      return this.status;
    // ... existing cases
    case "yourNewField":
      return this.yourNewField;
    default:
      return [];
  }
}
```

4. Handle special field types in `filterByUrlToken`:

```typescript
// For numeric fields, add to isNumericField check
const isNumericField = (name: string) => ["number", "linesCount", "yourIntField"].includes(name);

public filterByUrlToken(token: UrlToken) {
  if (isDateField(token.name) || isPriceField(token.name) || isNumericField(token.name)) {
    return token.value; // Return raw string values for UI
  }
  // ... rest of method
}
```

5. Update hook to handle new field:

```typescript
const fetchQueries = async ({
  status,
  // ... existing fields
  yourNewField,
}: OrderFetchingParams) => {
  // ... existing code

  const initialState = {
    // ... existing fields
    yourNewField: mapTextToOptions(yourNewField, "yourNewField"),
  };
};
```

6. Update helper with default values:

```typescript
// In API/initialState/helpers.ts
{
  channels: [],
  // ... existing fields
  yourNewField: [],
},
```

### Step 6: Create/Register Query Builders

**Determine Query Builder Type**:

- Variables can be handled by existing QueryVarsBuilders -> use default `FilterQueryVarsBuilderResolver` in `queryVariables.ts`
- There are some custom fields for this specific view only -> create custom builder and add a list of builders in `FilterQueryVarsBuilderResolver` constructor
- There are new fields that are also used in other views -> create new builder and add it as a default to `FilterQueryVarsBuilderResolver.getDefaultQueryVarsBuilders` list

**Create Custom Builder** (if needed):

```typescript
// FiltersQueryBuilder/queryVarsBuilders/YourFieldQueryVarsBuilder.ts
const SUPPORTED_FIELDS = new Set(["yourField"] as const);

export class YourFieldQueryVarsBuilder extends BaseMappableQueryVarsBuilder<{
  yourField?: YourInputType;
}> {
  canHandle(element: FilterElement): boolean {
    return SUPPORTED_FIELDS.has(element.value.value as any);
  }

  protected getQueryFieldName(element: FilterElement): string {
    return element.value.value;
  }

  protected getConditionValue(element: FilterElement): YourInputType {
    const baseResult = QueryVarsBuilderUtils.extractConditionValueFromFilterElement(element);
    // Transform as needed for your GraphQL input type
    return baseResult as YourInputType;
  }
}
```

**Register Builder**:

```typescript
// In queryVariables.ts, add to createOrderQueryVariables:
filterDefinitionResolver: new FilterQueryVarsBuilderResolver([
  new OrderIdQueryVarsBuilder(),
  // ... existing builders
  new YourFieldQueryVarsBuilder(), // ← Add here
  ...FilterQueryVarsBuilderResolver.getDefaultQueryVarsBuilders(),
]),
```

### Step 7: Handle Special Field Types

**For Numeric Fields** (integer inputs):

```typescript
// In FilterElement/Condition.ts
const isNumericField = ["number", "linesCount", "yourIntField"].includes(token.name);

if (isPriceField || isNumericField || isDate) {
  // Handle as string to prevent RangeInput crashes
}
```

**For Special UI Treatment**:

- Numeric fields need string preservation for RangeInput component
- Price fields need decimal conversion in query builder
- Date fields need proper formatting
- Boolean fields need Yes/No option display

## Field Type to Query Builder Reference

```typescript
// String fields (text input)
userEmail: StringFilterInput; // { eq?: string; oneOf?: string[] }

// Integer fields (number input)
linesCount: IntFilterInput; // { eq?: number; range?: {gte?: number; lte?: number} }

// Price fields (decimal input)
totalGross: PriceFilterInput; // { amount: DecimalFilterInput; currency?: string }

// Boolean fields (Yes/No select)
hasFulfillments: boolean; // true | false

// Date fields (date picker)
createdAt: DateTimeRangeInput; // { gte?: string; lte?: string }

// Enum fields (dropdown)
status: OrderStatusEnumFilterInput; // { eq?: OrderStatus; oneOf?: OrderStatus[] }

// ID arrays (multiselect)
ids: [ID!]; // ["id1", "id2", "id3"]

// Metadata (key-value pairs)
metadata: MetadataFilterInput; // { key: string; value?: { eq?: string } }
```

## API Migration Guide (FILTER → WHERE)

### Key Differences

1. **Field Names**: WHERE API sometimes uses different field names
   - `customer` → `user` in OrderWhereInput
   - Check GraphQL schema for exact field names

2. **Input Types**: WHERE API uses specific input types
   - FILTER: `string` → WHERE: `StringFilterInput`
   - FILTER: `number` → WHERE: `IntFilterInput`

3. **Enum Types**: Might use different enums for WHERE API
   - FILTER: `OrderStatusFilter` (includes READY_TO_CAPTURE, READY_TO_FULFILL)
   - WHERE: `OrderStatus` (excludes READY_TO_CAPTURE, READY_TO_FULFILL)

4. **Structure**: Different object structures
   - FILTER: `{metadata: [{key, value}]}` → WHERE: `{metadata: {key, value: {eq}}}`

### Migration Steps

1. **Update Field Mapping**:

```typescript
// In StaticQueryVarsBuilder.ts
private mapFieldNameToGraphQLForWhereApi(fieldName: string): string {
  switch (fieldName) {
    case "customer":
      return "user"; // Only for WHERE API
    default:
      return fieldName;
  }
}
```

2. **Create WHERE-Specific Builders**: For fields with different structures

## Testing Checklist

Before considering a new filter field complete, verify:

- [ ] **Field appears** in filter dropdown
- [ ] **Constraint options** are appropriate (no "in" for single-value fields)
- [ ] **GraphQL query** sends correct structure
- [ ] **URL persistence** - values stay in URL
- [ ] **Filter reopens** correctly from URL
- [ ] **Range inputs** work without crashing (for numeric fields)
- [ ] **Boolean values** show "Yes"/"No" correctly
- [ ] **No errors** in console ("Unknown filter element", etc.)
- [ ] **TypeScript** compilation passes
- [ ] **Test URLs** work as expected

### Example Test URLs

Test these scenarios:

```
# Single value
/orders?0%5Bs0.yourField%5D=testValue

# Range value (for numeric fields)
/orders?0%5Bs3.yourField%5D%5B0%5D=1&0%5Bs3.yourField%5D%5B1%5D=10

# Boolean value
/orders?0%5Bs0.yourBooleanField%5D=true
```

## Files Typically Modified

**Required for every new field:**

1. `constants.ts` - Field definition and constraints
2. `ValueProvider/UrlToken.ts` - STATICS array registration
3. `API/providers/*FilterAPIProvider.tsx` - Handler implementation
4. `ValueProvider/TokenArray/fetchingParams.ts` - Fetching parameters
5. `API/initialState/*` - Initial state interfaces and handling
6. `queryVariables.ts` - Query builder registration

**Optional (depending on field type):** 7. `FiltersQueryBuilder/queryVarsBuilders/*` - Custom query builder 8. `FilterElement/Condition.ts` - Special field type handling  
9. `API/initialState/helpers.ts` - Default values

## Common Error Messages and Solutions

| Error Message                          | Cause                                     | Solution                                                                     |
| -------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------- |
| "Unknown filter element: fieldName"    | Missing handler in FilterAPIProvider      | Add handler in `createAPIHandler`                                            |
| "Cannot read properties of undefined"  | Field not in initial state                | Add to InitialState interface and constructor                                |
| RangeInput component crash             | Integer values instead of strings         | Add field to `isNumericField` check                                          |
| GraphQL validation error               | Query builder output doesn't match schema | Check GraphQL schema, fix query builder                                      |
| Filter doesn't persist in URL          | Field not registered for URL tracking     | Add to STATICS array in UrlToken.ts                                          |
| Empty where object after first query   | Missing query builder or handler          | Verify query builder registration and handler                                |
| TypeScript compilation errors          | Missing interface updates                 | Update all related interfaces                                                |
| Boolean fields don't persist selection | Field name mismatch between files         | Ensure exact name match in constants.ts, UrlToken.ts, and InitialState files |
| GraphQL enum validation error          | Using wrong enum for API type             | Use OrderStatus for WHERE API, OrderStatusFilter for legacy FILTER API       |

## Advanced Patterns

### Context-Specific Field Mapping

When field names differ between APIs:

```typescript
private mapFieldNameToGraphQL(fieldName: string): string {
  // Only map for WHERE API context
  if (this.apiType === QueryApiType.WHERE) {
    switch (fieldName) {
      case "customer":
        return "user";
    }
  }
  return fieldName;
}
```

### Custom Query Builders

Create when standard builders don't fit your GraphQL schema:

```typescript
export class CustomFieldQueryVarsBuilder extends BaseMappableQueryVarsBuilder<{
  customField?: CustomInputType;
}> {
  canHandle(element: FilterElement): boolean {
    return element.value.value === "customField";
  }

  protected getConditionValue(element: FilterElement): CustomInputType {
    // Custom transformation logic here
    return transformedValue;
  }
}
```

### Conditional Field Handling

For fields that need different treatment based on context:

```typescript
// In InitialState.filterByUrlToken
public filterByUrlToken(token: UrlToken) {
  if (this.needsSpecialHandling(token.name)) {
    return this.handleSpecially(token);
  }
  return this.handleNormally(token);
}
```
