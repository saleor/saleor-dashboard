# Multi-Schema Support

This document describes the multi-schema GraphQL support in Saleor Dashboard, which allows the application to work with both stable and unstable API schemas.

## Overview

The dashboard supports dual GraphQL schemas:

- **Stable Schema**: The default schema used in production environments
- **Unstable Schema**: Optional schema for testing upcoming API changes

Both schemas are generated at build time, and runtime selection is controlled by the `FF_USE_UNSTABLE_SCHEMA` feature flag.

## Architecture

### Schema Files

```
schema-stable.graphql     # Stable schema (Saleor stable tags like 3.22, 3.23)
schema-unstable.graphql     # Unstable schema (latest from Saleor main branch)
schema.graphql          # Symlink to schema-stable.graphql (for tooling compatibility)
```

### Generated Files

Each schema generates its own set of TypeScript files:

```
src/graphql/
├── hooks.generated.ts                   # Hooks from stable schema
├── types.generated.ts                   # Types from stable schema
├── typePolicies.generated.ts            # Type policies from stable schema
├── fragmentTypes.generated.ts           # Fragment types from stable schema
├── hooksUnstable.generated.ts            # Hooks from unstable schema
├── typesUnstable.generated.ts            # Types from unstable schema
├── typePoliciesUnstable.generated.ts     # Type policies from unstable schema
├── fragmentTypesUnstable.generated.ts    # Fragment types from unstable schema
└── unstable/
    └── index.ts                         # Convenience export for all unstable files
```

## Usage

### Environment Configuration

Add this variable to your `.env` file:

```env
# Enable unstable schema (default: false)
FF_USE_UNSTABLE_SCHEMA=false
```

The same `API_URL` is used for both schema versions. The FF_USE_UNSTABLE_SCHEMA flag controls which schema types and hooks are used in the application.

### Importing GraphQL Hooks

By default, the application imports from the stable schema:

```typescript
// Default import uses stable schema
import { useProductListQuery } from "@dashboard/graphql";
```

To explicitly use the unstable schema, you have two options:

**Option 1: Import from the unstable directory (recommended for multiple imports)**

```typescript
// Import from unstable directory - includes all unstable types, hooks, and helpers
import {
  useProductListQuery,
  ProductListQuery,
  isUnstableSchema,
} from "@dashboard/graphql/unstable";
```

**Option 2: Import directly from generated files**

```typescript
// Import directly from specific generated files
import { useProductListQuery } from "@dashboard/graphql/hooksUnstable.generated";
import type { ProductListQuery } from "@dashboard/graphql/typesUnstable.generated";
```

### Runtime Schema Selection

Use the schema version helpers to check which schema is active:

```typescript
import { isUnstableSchema, getSchemaVersion } from "@dashboard/graphql";

function MyComponent() {
  // Check if unstable schema is enabled
  if (isUnstableSchema()) {
    // Use unstable-specific features
  }

  // Or get the version string
  const version = getSchemaVersion(); // "stable" or "unstable"
}
```

### Conditional Feature Implementation

For features that differ between schemas, you can conditionally use different hooks:

**Example 1: Skip-based approach (recommended)**

```typescript
import { isStableSchema, isUnstableSchema, useProductListQuery } from "@dashboard/graphql";
import { useProductListQuery as useProductListQueryStaging } from "@dashboard/graphql/unstable";

function ProductList() {
  // Execute only the relevant query based on schema version
  const { data: dataMain } = useProductListQuery({
    skip: isUnstableSchema()
  });
  const { data: dataStaging } = useProductListQueryStaging({
    skip: isStableSchema()
  });

  // Use whichever data is available
  const data = dataStaging ?? dataMain;

  return <div>{/* Use data */}</div>;
}
```

**Example 2: Dynamic hook selection**

```typescript
import { isUnstableSchema } from "@dashboard/graphql";
import { useProductListQuery as useProductListQueryMain } from "@dashboard/graphql";
import { useProductListQuery as useProductListQueryStaging } from "@dashboard/graphql/unstable";

function ProductList() {
  // Choose the appropriate hook based on schema version
  const useProductList = isUnstableSchema() ? useProductListQueryStaging : useProductListQueryMain;

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
├── queries.ts          # Stable schema queries
└── queries.unstable.ts  # Unstable-specific queries
```

## Development

### Fetching Schemas

```bash
# Fetch both schemas
pnpm run fetch-schema

# Fetch individual schemas
pnpm run fetch-schema:stable
pnpm run fetch-schema:unstable
```

### Generating Types

```bash
# Generate types for both schemas
pnpm run generate

# Generate for individual schemas
pnpm run generate:stable
pnpm run generate:unstable
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
3. Stable schema generates base types (no suffix)
4. Unstable schema generates Unstable-suffixed document variables

### Runtime

1. `FF_USE_UNSTABLE_SCHEMA` feature flag determines which schema is active
2. Apollo Client loads the appropriate `fragmentTypes` based on the flag
3. `getApiUrl()` returns the same API URL regardless of the flag
4. Application code imports hooks from the appropriate generated file

## Important Notes

### Hook and Type Names

- **Hook names are identical** in both versions (e.g., `useProductListQuery`)
- **Type names are identical** in both versions (e.g., `ProductListQuery`)
- GraphQL document variables have Unstable suffix in the unstable version (e.g., `ProductListUnstable`)

This means you cannot import both versions in the same file without aliasing:

```typescript
// This works - import with aliases (recommended: use unstable directory)
import { useProductListQuery as useProductListQueryMain } from "@dashboard/graphql";
import { useProductListQuery as useProductListQueryStaging } from "@dashboard/graphql/unstable";

// This also works - import directly from generated files
import { useProductListQuery as useProductListQueryMain } from "@dashboard/graphql/hooks.generated";
import { useProductListQuery as useProductListQueryStaging } from "@dashboard/graphql/hooksUnstable.generated";

// This doesn't work - naming conflict
import { useProductListQuery } from "@dashboard/graphql";
import { useProductListQuery } from "@dashboard/graphql/unstable"; // ERROR!
```

### Unstable Directory Convenience Export

The `src/graphql/unstable/index.ts` file provides a convenient way to import all unstable-related exports:

```typescript
// Instead of importing from multiple files...
import { useProductListQuery } from "@dashboard/graphql/hooksUnstable.generated";
import type { ProductListQuery } from "@dashboard/graphql/typesUnstable.generated";
import { isUnstableSchema } from "@dashboard/graphql/schemaVersion";

// You can import everything from one place
import {
  useProductListQuery,
  ProductListQuery,
  isUnstableSchema,
} from "@dashboard/graphql/unstable";
```

This export includes:

- All unstable hooks (`hooksUnstable.generated.ts`)
- All unstable types (`typesUnstable.generated.ts`)
- Type policies (`typePoliciesUnstable.generated.ts`)
- Fragment types (`fragmentTypesUnstable.generated.ts`)
- Schema version helpers (`schemaVersion.ts`)
- Extended types (`extendedTypes.ts`)

### Single Apollo Client

The application uses a single Apollo Client instance that connects to the configured API_URL. The same API endpoint is used for both schema versions - only the client-side schema types and fragmentTypes differ based on the FF_USE_UNSTABLE_SCHEMA flag.

### Schema Compatibility

When `FF_USE_UNSTABLE_SCHEMA=false` (default):

- Uses stable schema
- Apollo Client uses stable fragmentTypes
- All imports from `@dashboard/graphql` use stable types

When `FF_USE_UNSTABLE_SCHEMA=true`:

- Uses unstable schema
- Apollo Client uses unstable fragmentTypes
- Must explicitly import from Unstable generated files for schema-specific features
- Connects to the same API_URL (you must know what schema version is provided by this endpoint)

## Adding New Queries/Mutations

### For Queries/Mutations That Work with Both Schemas

1. Add your query/mutation to the appropriate file (e.g., `src/products/queries.ts`)
2. Run `pnpm run generate` to generate hooks for both schemas
3. Import from the default export for stable schema:
   ```typescript
   import { useMyNewQuery } from "@dashboard/graphql";
   ```
4. For unstable-specific features, import from the unstable directory:
   ```typescript
   import { useMyNewQuery } from "@dashboard/graphql/unstable";
   ```

### For Unstable-Only Queries

If a query uses fields that only exist in the unstable schema:

1. Create a separate file (e.g., `src/products/queries.unstable.ts`)
2. Define your unstable-specific query there
3. Run `pnpm run generate:unstable` to generate hooks
4. Import from the unstable directory:
   ```typescript
   import { useMyNewQuery } from "@dashboard/graphql/unstable";
   ```

This keeps schema-specific code organized and prevents type errors when generating stable schema types.

## Testing

### Testing with Different Schemas

1. Set `FF_USE_UNSTABLE_SCHEMA=false` in your `.env`
2. Start the dev server: `pnpm run dev`
3. Test stable schema behavior

Then:

1. Set `FF_USE_UNSTABLE_SCHEMA=true` in your `.env`
2. Restart the dev server
3. Test unstable schema behavior

Note: Your API must support both schema versions for this to work correctly.

### CI/CD Considerations

- Both schemas must generate successfully for builds to pass
- Type checking validates both schema versions
- Consider running E2E tests against both schemas

## Future Improvements

### Potential Optimizations

1. **Differential Generation**: Generate only changed types for Unstable to reduce bundle size (this should not be a huge deal if we migrate from enums to type literals)
2. **Automatic Schema Switching**: Detect API version from response headers
3. **Schema Compatibility Checker**: Tool to validate backward compatibility
4. **Runtime Type Validation**: Validate API responses match the active schema

### Migration Path

As new schema versions are released:

1. Update `fetch-schema:unstable` script to fetch the new version
2. Run `pnpm run generate`
3. Fix any type errors in application code
4. Test thoroughly with the new schema
5. When ready, promote unstable to stable by updating `fetch-schema:stable` to point to the new version

## Related Documentation

### Configuration Files

- [Stable Schema Codegen Configuration](../codegen-stable.ts)
- [Unstable Schema Codegen Configuration](../codegen-unstable.ts)
- [Environment Variables](../.env.template)
- [GraphQL Schema Configuration](../graphql.config.ts)
