# Multi-Schema Support

This document describes the multi-schema GraphQL support in Saleor Dashboard, which allows the application to work with both production (3.22) and staging (3.23) API schemas.

## Overview

The dashboard supports dual GraphQL schemas:

- **Production Schema (3.22)**: The default schema used in production environments
- **Staging Schema (3.23)**: Optional schema for testing upcoming API changes

Both schemas are generated at build time, and runtime selection is controlled by the `FF_USE_SCHEMA_323` feature flag.

## Architecture

### Schema Files

```
schema-3.22.graphql     # Production schema (Saleor 3.22)
schema-3.23.graphql     # Staging schema (Saleor 3.23)
schema.graphql          # Copy of schema-3.22.graphql (for tooling compatibility)
```

### Generated Files

Each schema generates its own set of TypeScript files:

```
src/graphql/
├── hooks.generated.ts              # Hooks from 3.22 schema
├── types.generated.ts              # Types from 3.22 schema
├── typePolicies.generated.ts       # Type policies from 3.22 schema
├── fragmentTypes.generated.ts      # Fragment types from 3.22 schema
├── hooksV323.generated.ts          # Hooks from 3.23 schema
├── typesV323.generated.ts          # Types from 3.23 schema
├── typePoliciesV323.generated.ts   # Type policies from 3.23 schema
└── fragmentTypesV323.generated.ts  # Fragment types from 3.23 schema
```

## Usage

### Environment Configuration

Add this variable to your `.env` file:

```env
# Enable staging schema (default: false)
FF_USE_SCHEMA_323=false
```

The same `API_URL` is used for both schema versions. The FF_USE_SCHEMA_323 flag controls which schema types and hooks are used in the application.

### Importing GraphQL Hooks

By default, the application imports from the production schema:

```typescript
// Default import uses production schema (3.22)
import { useProductListQuery } from "@dashboard/graphql";
```

To explicitly use the staging schema, import directly from the generated file:

```typescript
// Explicitly use staging schema (3.23)
import { useProductListQuery } from "@dashboard/graphql/hooksV323.generated";
import type { ProductListQuery } from "@dashboard/graphql/typesV323.generated";
```

### Runtime Schema Selection

Use the schema version helpers to check which schema is active:

```typescript
import { useSchema323, getSchemaVersion } from "@dashboard/graphql";

function MyComponent() {
  // Check if staging schema is enabled
  if (useSchema323()) {
    // Use staging-specific features
  }

  // Or get the version string
  const version = getSchemaVersion(); // "322" or "323"
}
```

### Conditional Feature Implementation

For features that differ between schemas:

```typescript
import { useSchema323 } from "@dashboard/graphql";
import { useProductListQuery as useProductListQueryV322 } from "@dashboard/graphql/hooks.generated";
import { useProductListQuery as useProductListQueryV323 } from "@dashboard/graphql/hooksV323.generated";

function ProductList() {
  // Choose the appropriate hook based on schema version
  const useProductList = useSchema323() ? useProductListQueryV323 : useProductListQueryV322;

  const { data } = useProductList({
    variables: { /* ... */ }
  });

  return <div>{/* ... */}</div>;
}
```

## Development

### Fetching Schemas

```bash
# Fetch both schemas
pnpm run fetch-schema

# Fetch individual schemas
pnpm run fetch-schema-3.22
pnpm run fetch-schema-3.23
```

### Generating Types

```bash
# Generate types for both schemas
pnpm run generate

# Generate for individual schemas
pnpm run generate:3.22
pnpm run generate:3.23
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
4. Staging schema generates V323-suffixed document variables

### Runtime

1. `FF_USE_SCHEMA_323` feature flag determines which schema is active
2. Apollo Client loads the appropriate `fragmentTypes` based on the flag
3. `getApiUrl()` returns the staging API URL when the flag is enabled
4. Application code imports hooks from the appropriate generated file

## Important Notes

### Hook and Type Names

- **Hook names are identical** in both versions (e.g., `useProductListQuery`)
- **Type names are identical** in both versions (e.g., `ProductListQuery`)
- GraphQL document variables have V323 suffix in the staging version (e.g., `ProductListV323`)

This means you cannot import both versions in the same file without aliasing:

```typescript
// This works - import with aliases
import { useProductListQuery as useProductListV322 } from "@dashboard/graphql/hooks.generated";
import { useProductListQuery as useProductListV323 } from "@dashboard/graphql/hooksV323.generated";

// This doesn't work - naming conflict
import { useProductListQuery } from "@dashboard/graphql/hooks.generated";
import { useProductListQuery } from "@dashboard/graphql/hooksV323.generated"; // ERROR!
```

### Single Apollo Client

The application uses a single Apollo Client instance that connects to the configured API_URL. The same API endpoint is used for both schema versions - only the client-side schema types and fragmentTypes differ based on the FF_USE_SCHEMA_323 flag.

### Schema Compatibility

When `FF_USE_SCHEMA_323=false` (default):

- Uses production schema (3.22)
- Apollo Client uses 3.22 fragmentTypes
- All imports from `@dashboard/graphql` use production types

When `FF_USE_SCHEMA_323=true`:

- Uses staging schema (3.23)
- Apollo Client uses 3.23 fragmentTypes
- Must explicitly import from V323 generated files for schema-specific features
- Connects to the same API_URL (the API should support both schema versions)

## Adding New Queries/Mutations

When adding new GraphQL operations:

1. Add your query/mutation to the appropriate file (e.g., `src/products/queries.ts`)
2. Run `pnpm run generate` to generate hooks for both schemas
3. Import from the default export for production schema:
   ```typescript
   import { useMyNewQuery } from "@dashboard/graphql";
   ```
4. For staging-specific features, import explicitly:
   ```typescript
   import { useMyNewQuery } from "@dashboard/graphql/hooksV323.generated";
   ```

## Testing

### Testing with Different Schemas

1. Set `FF_USE_SCHEMA_323=false` in your `.env`
2. Start the dev server: `pnpm run dev`
3. Test production schema (3.22) behavior

Then:

1. Set `FF_USE_SCHEMA_323=true` in your `.env`
2. Restart the dev server
3. Test staging schema (3.23) behavior

Note: Your API must support both schema versions for this to work correctly.

### CI/CD Considerations

- Both schemas must generate successfully for builds to pass
- Type checking validates both schema versions
- Consider running E2E tests against both schemas

## Troubleshooting

### Build Failures

**Error**: `Module not found: Can't resolve './hooksV323.generated'`

**Solution**: Run `pnpm run generate` to create all generated files.

---

**Error**: TypeScript duplicate export errors

**Solution**: Don't re-export V323 types from `src/graphql/index.ts`. Import them directly from the generated files.

### Runtime Errors

**Error**: `Cannot read property 'possibleTypes' of undefined`

**Solution**: Ensure `fragmentTypesV323.generated.ts` exists and is properly generated.

---

**Error**: API returns unexpected data or errors with staging flag enabled

**Solution**: Verify your API supports the schema version you're trying to use (3.23). The API must be compatible with the schema version selected by FF_USE_SCHEMA_323.

### Type Errors

**Error**: Type mismatch between production and staging types

**Solution**: This is expected if the schemas differ. Use type guards or conditional logic to handle schema-specific differences.

## Future Improvements

### Potential Optimizations

1. **Differential Generation**: Generate only changed types for V323 to reduce bundle size
2. **Automatic Schema Switching**: Detect API version from response headers
3. **Schema Compatibility Checker**: Tool to validate backward compatibility
4. **Runtime Type Validation**: Validate API responses match the active schema

### Migration Path

As new schema versions are released:

1. Update `fetch-schema-3.23` script to fetch the new version
2. Run `pnpm run generate`
3. Fix any type errors in application code
4. Test thoroughly with the new schema
5. When ready, promote 3.23 to production (3.22) and fetch 3.24 as staging

## Related Documentation

- [GraphQL Codegen Configuration](./codegen-3.22.ts)
- [Environment Variables](./.env.template)
- [GraphQL Schema Configuration](./graphql.config.ts)

## Questions?

If you have questions about the multi-schema setup, please refer to:

- This documentation
- Code comments in `src/graphql/schemaVersion.ts`
- Code comments in `src/graphql/index.ts`
