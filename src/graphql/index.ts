// Schema version helpers
export * from "./schemaVersion";

// Extended types (schema-agnostic)
export * from "./extendedTypes";

// Main schema - Base exports
// These are the default exports used by the application
export * from "./hooks.generated";
export * from "./typePolicies.generated";
export * from "./types.generated";

/**
 * Staging schema hooks and types
 *
 * IMPORTANT: To avoid naming conflicts, Staging hooks and types are NOT exported
 * from this index file. Import them directly from their generated files:
 *
 * @example
 * ```typescript
 * // Use Staging hooks explicitly
 * import { useProductListQuery } from "@dashboard/graphql/hooksStaging.generated";
 * import type { ProductListQuery, ProductListQueryVariables } from "@dashboard/graphql/typesStaging.generated";
 * ```
 *
 * Hook names and type names are the same in both versions. Application code
 * should choose which file to import from based on the schema version.
 */
