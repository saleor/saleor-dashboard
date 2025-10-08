---
"saleor-dashboard": patch
---

Remove `@deprecated` JSDoc annotations from generated TypeScript types for fields without deprecation reasons.

This change updates the GraphQL-generated TypeScript types to reflect the actual behavior of `@graphql-codegen/typescript` plugin: JSDoc `@deprecated` annotations are only generated for GraphQL fields that include an explicit deprecation `reason` in the schema (e.g., `@deprecated(reason: "...")`).

Fields marked with bare `@deprecated` directives (without reasons) in the GraphQL schema no longer have corresponding JSDoc annotations in the generated types. This is expected behavior and does not affect functionality - the fields are still deprecated in the backend schema.

Example:
- `@deprecated(reason: "Use root-level channel argument instead.")` → Generates JSDoc `@deprecated` comment ✅
- `@deprecated` (no reason) → No JSDoc comment generated ❌

This aligns the generated types with the code generator's standard behavior and removes misleading annotations for fields where the deprecation reason was not provided in the schema.
