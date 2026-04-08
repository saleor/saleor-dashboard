---
"saleor-dashboard": patch
---

Set strict-typed Scalars: JSON and JSONString. Previously Codegen generated `any` types, making them insecure in the codebase. Now they are `unknown` and `string`. Now it's explicit that JSON must be narrowed (e.g. with Zod schema) and JSONString must be first parsed.
