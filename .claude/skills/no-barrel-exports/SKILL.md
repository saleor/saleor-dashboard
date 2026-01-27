---
name: no-barrel-exports
description: >
  Enforce direct imports/exports instead of barrel (index.ts) files.
  Use when writing new code, creating new components, adding new modules,
  or refactoring imports in this repository. Prevents creation of index.ts
  or index.tsx files that only re-export from other files.
---

# No Barrel Exports

## Rule

Never create `index.ts` or `index.tsx` files that re-export from other files. Import directly from the source file.

```typescript
// ❌ Don't create index.ts barrel files
// components/index.ts
export { Button } from "./Button";
export { Input } from "./Input";

// ❌ Don't import from directory (relies on index.ts)
import { Button } from "./components";
import { ProductList } from "@dashboard/products";

// ✅ Import directly from the file
import { Button } from "./components/Button";
import { ProductList } from "@dashboard/products/components/ProductList";
```

## When Creating New Files

- Name the file after its primary export: `ProductList.tsx`, `useProductForm.ts`, `productUtils.ts`
- Place the file in the appropriate feature directory
- Export named exports directly from the file — no `index.ts` wrapper

## When Adding Exports to Existing Modules

- Add the export in the source file, not in an index file
- Update imports at call sites to point to the source file directly

## Exceptions

- `index.tsx` files that are **route entry points** (e.g., a page component that IS the index) are fine — they contain real code, not just re-exports
- Existing `index.ts` barrel files should not be deleted as part of unrelated work — that is a separate refactoring task
