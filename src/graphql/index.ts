// Schema version helpers
export * from "./schemaVersion";

// Extended types (schema-agnostic)
export * from "./extendedTypes";

// Schema 3.22 (Production) - Base exports
// These are the default exports used by the application
export * from "./hooks.generated";
export * from "./typePolicies.generated";
export * from "./types.generated";

/**
 * Schema 3.23 (Staging) - V323 hooks and types
 *
 * IMPORTANT: To avoid naming conflicts, V323 hooks and types are NOT exported
 * from this index file. Import them directly from their generated files:
 *
 * @example
 * ```typescript
 * // Use V323 hooks explicitly
 * import { useProductListQuery } from "@dashboard/graphql/hooksV323.generated";
 * import type { ProductListQuery, ProductListQueryVariables } from "@dashboard/graphql/typesV323.generated";
 * ```
 *
 * Hook names and type names are the same in both versions. Application code
 * should choose which file to import from based on the schema version.
 */
