# Multi-Schema Support

This document describes the multi-schema GraphQL support in Saleor Dashboard, which allows the application to work with both production (main) and staging (staging) API schemas.

## Overview

The dashboard supports dual GraphQL schemas:

- **Production Schema (main)**: The default schema used in production environments
- **Staging Schema (staging)**: Optional schema for testing upcoming API changes

Both schemas are generated at build time, and runtime selection is controlled by the `FF_USE_STAGING_SCHEMA` feature flag.

## Architecture

### Schema Files

```
schema-main.graphql     # Production schema (Saleor main)
schema-staging.graphql     # Staging schema (Saleor staging)
schema.graphql          # Copy of schema-main.graphql (for tooling compatibility)
```

### Generated Files

Each schema generates its own set of TypeScript files:

```
src/graphql/
├── hooks.generated.ts                   # Hooks from main schema
├── types.generated.ts                   # Types from main schema
├── typePolicies.generated.ts            # Type policies from main schema
├── fragmentTypes.generated.ts           # Fragment types from main schema
├── hooksStaging.generated.ts            # Hooks from staging schema
├── typesStaging.generated.ts            # Types from staging schema
├── typePoliciesStaging.generated.ts     # Type policies from staging schema
├── fragmentTypesStaging.generated.ts    # Fragment types from staging schema
└── staging/
    └── index.ts                         # Convenience export for all staging files
```

## Usage

### Environment Configuration

Add this variable to your `.env` file:

```env
# Enable staging schema (default: false)
FF_USE_STAGING_SCHEMA=false
```

The same `API_URL` is used for both schema versions. The FF_USE_STAGING_SCHEMA flag controls which schema types and hooks are used in the application.

### Importing GraphQL Hooks

By default, the application imports from the production schema:

```typescript
// Default import uses production schema (main)
import { useProductListQuery } from "@dashboard/graphql";
```

To explicitly use the staging schema, you have two options:

**Option 1: Import from the staging directory (recommended for multiple imports)**

```typescript
// Import from staging directory - includes all staging types, hooks, and helpers
import { useProductListQuery, ProductListQuery, isStagingSchema } from "@dashboard/graphql/staging";
```

**Option 2: Import directly from generated files**

```typescript
// Import directly from specific generated files
import { useProductListQuery } from "@dashboard/graphql/hooksStaging.generated";
import type { ProductListQuery } from "@dashboard/graphql/typesStaging.generated";
```

### Runtime Schema Selection

Use the schema version helpers to check which schema is active:

```typescript
import { isStagingSchema, getSchemaVersion } from "@dashboard/graphql";

function MyComponent() {
  // Check if staging schema is enabled
  if (isStagingSchema()) {
    // Use staging-specific features
  }

  // Or get the version string
  const version = getSchemaVersion(); // "main" or "staging"
}
```

### Conditional Feature Implementation

For features that differ between schemas, you can conditionally use different hooks:

**Example 1: Skip-based approach (recommended)**

```typescript
import { isMainSchema, isStagingSchema, useProductListQuery } from "@dashboard/graphql";
import { useProductListQuery as useProductListQueryStaging } from "@dashboard/graphql/staging";

function ProductList() {
  // Execute only the relevant query based on schema version
  const { data: dataMain } = useProductListQuery({
    skip: isStagingSchema()
  });
  const { data: dataStaging } = useProductListQueryStaging({
    skip: isMainSchema()
  });

  // Use whichever data is available
  const data = dataStaging ?? dataMain;

  return <div>{/* Use data */}</div>;
}
```

**Example 2: Dynamic hook selection**

```typescript
import { isStagingSchema } from "@dashboard/graphql";
import { useProductListQuery as useProductListQueryMain } from "@dashboard/graphql";
import { useProductListQuery as useProductListQueryStaging } from "@dashboard/graphql/staging";

function ProductList() {
  // Choose the appropriate hook based on schema version
  const useProductList = isStagingSchema() ? useProductListQueryStaging : useProductListQueryMain;

  const { data } = useProductList({
    variables: { /* ... */ }
  });

  return <div>{/* ... */}</div>;
}
```

### Organizing Schema-Specific Queries

For queries that only exist in one schema version, you can organize them in separate files:

```
src/products/
├── queries.ts          # Main schema queries
└── queries.staging.ts  # Staging-specific queries
```

This pattern is demonstrated in the codebase:

- `src/products/queries.ts` - Contains `productPoc322` query for main schema
- `src/products/queries.staging.ts` - Contains `productPoc323` query with staging-specific fields
- `src/siteSettings/views/index.tsx` - Shows practical usage of both schemas with conditional execution

## Development

### Fetching Schemas

```bash
# Fetch both schemas
pnpm run fetch-schema

# Fetch individual schemas
pnpm run fetch-schema-main
pnpm run fetch-schema-staging
```

### Generating Types

```bash
# Generate types for both schemas
pnpm run generate

# Generate for individual schemas
pnpm run generate:main
pnpm run generate:staging
```

### Type Checking

The standard type checking commands work with the multi-schema setup:

```bash
# Type check with both schemas
pnpm run check-types
```

## How It Works

### Build Time

1. Both schemas are fetched from the Saleor repository
2. GraphQL Codegen generates separate TypeScript files for each schema
3. Production schema generates base types (no suffix)
4. Staging schema generates Staging-suffixed document variables

### Runtime

1. `FF_USE_STAGING_SCHEMA` feature flag determines which schema is active
2. Apollo Client loads the appropriate `fragmentTypes` based on the flag
3. `getApiUrl()` returns the same API URL regardless of the flag
4. Application code imports hooks from the appropriate generated file

## Important Notes

### Hook and Type Names

- **Hook names are identical** in both versions (e.g., `useProductListQuery`)
- **Type names are identical** in both versions (e.g., `ProductListQuery`)
- GraphQL document variables have Staging suffix in the staging version (e.g., `ProductListStaging`)

This means you cannot import both versions in the same file without aliasing:

```typescript
// This works - import with aliases (recommended: use staging directory)
import { useProductListQuery as useProductListQueryMain } from "@dashboard/graphql";
import { useProductListQuery as useProductListQueryStaging } from "@dashboard/graphql/staging";

// This also works - import directly from generated files
import { useProductListQuery as useProductListQueryMain } from "@dashboard/graphql/hooks.generated";
import { useProductListQuery as useProductListQueryStaging } from "@dashboard/graphql/hooksStaging.generated";

// This doesn't work - naming conflict
import { useProductListQuery } from "@dashboard/graphql";
import { useProductListQuery } from "@dashboard/graphql/staging"; // ERROR!
```

### Staging Directory Convenience Export

The `src/graphql/staging/index.ts` file provides a convenient way to import all staging-related exports:

```typescript
// Instead of importing from multiple files...
import { useProductListQuery } from "@dashboard/graphql/hooksStaging.generated";
import type { ProductListQuery } from "@dashboard/graphql/typesStaging.generated";
import { isStagingSchema } from "@dashboard/graphql/schemaVersion";

// You can import everything from one place
import { useProductListQuery, ProductListQuery, isStagingSchema } from "@dashboard/graphql/staging";
```

This export includes:

- All staging hooks (`hooksStaging.generated.ts`)
- All staging types (`typesStaging.generated.ts`)
- Type policies (`typePoliciesStaging.generated.ts`)
- Fragment types (`fragmentTypesStaging.generated.ts`)
- Schema version helpers (`schemaVersion.ts`)
- Extended types (`extendedTypes.ts`)

### Single Apollo Client

The application uses a single Apollo Client instance that connects to the configured API_URL. The same API endpoint is used for both schema versions - only the client-side schema types and fragmentTypes differ based on the FF_USE_STAGING_SCHEMA flag.

### Schema Compatibility

When `FF_USE_STAGING_SCHEMA=false` (default):

- Uses production schema (main)
- Apollo Client uses main fragmentTypes
- All imports from `@dashboard/graphql` use production types

When `FF_USE_STAGING_SCHEMA=true`:

- Uses staging schema (staging)
- Apollo Client uses staging fragmentTypes
- Must explicitly import from Staging generated files for schema-specific features
- Connects to the same API_URL (the API should support both schema versions)

## Adding New Queries/Mutations

### For Queries/Mutations That Work with Both Schemas

1. Add your query/mutation to the appropriate file (e.g., `src/products/queries.ts`)
2. Run `pnpm run generate` to generate hooks for both schemas
3. Import from the default export for production schema:
   ```typescript
   import { useMyNewQuery } from "@dashboard/graphql";
   ```
4. For staging-specific features, import from the staging directory:
   ```typescript
   import { useMyNewQuery } from "@dashboard/graphql/staging";
   ```

### For Staging-Only Queries

If a query uses fields that only exist in the staging schema:

1. Create a separate file (e.g., `src/products/queries.staging.ts`)
2. Define your staging-specific query there
3. Run `pnpm run generate:staging` to generate hooks
4. Import from the staging directory:
   ```typescript
   import { useMyNewQuery } from "@dashboard/graphql/staging";
   ```

This keeps schema-specific code organized and prevents type errors when generating main schema types.

## Testing

### Testing with Different Schemas

1. Set `FF_USE_STAGING_SCHEMA=false` in your `.env`
2. Start the dev server: `pnpm run dev`
3. Test production schema (main) behavior

Then:

1. Set `FF_USE_STAGING_SCHEMA=true` in your `.env`
2. Restart the dev server
3. Test staging schema (staging) behavior

Note: Your API must support both schema versions for this to work correctly.

### CI/CD Considerations

- Both schemas must generate successfully for builds to pass
- Type checking validates both schema versions
- Consider running E2E tests against both schemas

## Troubleshooting

### Build Failures

**Error**: `Module not found: Can't resolve './hooksStaging.generated'`

**Solution**: Run `pnpm run generate` to create all generated files.

---

**Error**: TypeScript duplicate export errors

**Solution**: Don't re-export Staging types from `src/graphql/index.ts`. Import them directly from the generated files.

### Runtime Errors

**Error**: `Cannot read property 'possibleTypes' of undefined`

**Solution**: Ensure `fragmentTypesStaging.generated.ts` exists and is properly generated.

---

**Error**: API returns unexpected data or errors with staging flag enabled

**Solution**: Verify your API supports the schema version you're trying to use (staging). The API must be compatible with the schema version selected by FF_USE_STAGING_SCHEMA.

### Type Errors

**Error**: Type mismatch between production and staging types

**Solution**: This is expected if the schemas differ. Use type guards or conditional logic to handle schema-specific differences.

## Future Improvements

### Potential Optimizations

1. **Differential Generation**: Generate only changed types for Staging to reduce bundle size
2. **Automatic Schema Switching**: Detect API version from response headers
3. **Schema Compatibility Checker**: Tool to validate backward compatibility
4. **Runtime Type Validation**: Validate API responses match the active schema

### Migration Path

As new schema versions are released:

1. Update `fetch-schema:staging` script to fetch the new version
2. Run `pnpm run generate`
3. Fix any type errors in application code
4. Test thoroughly with the new schema
5. When ready, promote staging to main by updating `fetch-schema:main` to point to the new version

## Related Documentation

### Configuration Files

- [Main Schema Codegen Configuration](../codegen-main.ts)
- [Staging Schema Codegen Configuration](../codegen-staging.ts)
- [Environment Variables](../.env.template)
- [GraphQL Schema Configuration](../graphql.config.ts)

### Example Implementations

- `src/graphql/schemaVersion.ts` - Schema version helper functions
- `src/graphql/index.ts` - Main schema exports and documentation
- `src/graphql/staging/index.ts` - Staging schema convenience exports
- `src/products/queries.ts` - Example main schema query
- `src/products/queries.staging.ts` - Example staging-specific query
- `src/siteSettings/views/index.tsx` - Practical usage example with conditional execution

## Questions?

If you have questions about the multi-schema setup, please refer to:

- This documentation
- Code comments in `src/graphql/schemaVersion.ts`
- Code comments in `src/graphql/index.ts`
- Code comments in `src/graphql/staging/index.ts`
- Example implementations listed above
