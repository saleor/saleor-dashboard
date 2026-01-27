---
name: separate-business-logic
description: >
  Extract business logic from React components into separate, testable files.
  Use when refactoring components that have inlined data transformations, mapping,
  filtering, sorting, formatting, validation, conditional logic, or computations
  mixed into JSX markup. Also use when asked to improve testability of a component
  or move logic out of a React component.
---

# Separate Business Logic

## Goal

Extract business logic out of React components into standalone, testable files. Components should focus on rendering and user interaction, delegating data transformations, mapping, filtering, sorting, formatting, validation, and decision-making to separate modules.

## What Counts as Business Logic

- Data mapping and transformations (e.g., converting API responses to UI models)
- Filtering, sorting, grouping collections
- Validation rules and error message resolution
- Conditional logic that determines what to display or which action to take
- Formatting (dates, currencies, percentages, labels)
- Computations and aggregations
- State machine transitions or workflow steps

## Where to Put It

Place logic in a separate file **next to the component** that uses it:

```
ComponentName/
├── ComponentName.tsx          # UI only
├── useComponentName.ts        # Hook (optional, bridges logic → component)
├── componentNameUtils.ts      # Pure logic functions
├── componentNameUtils.test.ts # Unit tests for the logic
└── ComponentName.module.css
```

- **`*Utils.ts`** — set of pure functions or a cohesive class. No React imports needed.
- **`use*.ts`** — a custom hook, when logic needs React context, state, or effects. The hook should call into the utils rather than inlining logic.
- Components import from utils directly, or consume them through the hook.

## Rules

1. **No logic inlined in JSX/HTML markup.** Move ternaries, maps with transformations, and computed values out of the `return` block into named variables, functions, or the hook.

2. **Pure functions first.** If logic doesn't need React state, context, or lifecycle — write it as a plain function in `*Utils.ts`. These are the easiest to test.

3. **Hooks wrap context-dependent logic.** When logic requires `useContext`, `useState`, or other hooks, create a `use*.ts` hook. Keep the hook thin — delegate heavy work to util functions and pass results back.

4. **Pattern: logic → hook → component.**

   ```
   // utils: pure logic
   export const calculateTotal = (items: Item[]): number => { ... }

   // hook: connects React world to logic
   export const useCart = () => {
     const items = useContext(CartContext);
     const total = useMemo(() => calculateTotal(items), [items]);
     return { items, total };
   };

   // component: renders
   export const Cart = () => {
     const { items, total } = useCart();
     return <Box>...</Box>;
   };
   ```

5. **Test the logic, not the wiring.** Unit test `*Utils.ts` functions thoroughly — edge cases, empty inputs, error states. Hook tests and component tests can be lighter since they just verify integration.

6. **Name functions by intent.** Use descriptive names: `getActiveFilters`, `formatPriceRange`, `resolveStatusBadgeColor` — not `processData` or `transform`.

## Testing Expectations

- Every `*Utils.ts` file must have a corresponding `*.test.ts` file.
- Tests should use `// Arrange // Act // Assert` comments.
- Declare fixture types explicitly: `const fixture: FixtureType = { ... }`.
- Cover: happy path, empty/null inputs, boundary values, and error cases.

```typescript
// calculateTotal.test.ts
import { calculateTotal } from "./cartUtils";
import { Item } from "./types";

describe("calculateTotal", () => {
  it("sums item prices multiplied by quantity", () => {
    // Arrange
    const items: Item[] = [
      { price: 10, quantity: 2 },
      { price: 5, quantity: 3 },
    ];

    // Act
    const result = calculateTotal(items);

    // Assert
    expect(result).toBe(35);
  });

  it("returns 0 for empty list", () => {
    // Arrange
    const items: Item[] = [];

    // Act
    const result = calculateTotal(items);

    // Assert
    expect(result).toBe(0);
  });
});
```

## Applying This Skill

When asked to separate business logic:

1. Read the target component(s) to identify inlined logic.
2. Catalog each piece of logic (transformations, conditionals, formatting, etc.).
3. Create `*Utils.ts` with extracted pure functions.
4. If React context/state is needed, create or update a `use*.ts` hook that uses the utils.
5. Update the component to import from utils / hook — remove inlined logic.
6. Write unit tests for every extracted function.
7. Run `pnpm run test:quiet <test_file>` to verify.
8. Run `pnpm run lint` and `pnpm run check-types` to ensure nothing broke.
