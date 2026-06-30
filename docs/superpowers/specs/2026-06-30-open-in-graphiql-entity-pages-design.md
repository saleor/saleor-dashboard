# Open in GraphiQL — roll out to entity detail pages

**Date:** 2026-06-30
**Status:** Approved (direction A, lean queries, no manual verification)

## Goal

The Order Details and Product Details pages already expose an "Open this … in
GraphiQL" action that opens the internal Dev Mode panel pre-filled with a query
and variables for the current entity. Extend the same action to the remaining
entity detail pages so a developer can jump from any record into GraphiQL with a
sensible starting query.

## Existing pattern (reference)

The action is **not** an external link. It drives the internal Dev Mode panel via
`useDevModeContext()`:

```ts
const context = useDevModeContext();

const openPlaygroundURL = () => {
  context.setDevModeContent(defaultGraphiQLQuery); // query string for this module
  context.setVariables(`{ "id": "${entity?.id}" }`); // variables
  context.setDevModeVisibility(true); // open the panel
};
```

The handler is wired into the page's existing `TopNav.Menu` as one more item:

```ts
{
  label: intl.formatMessage(messages.openGraphiQL),
  onSelect: openPlaygroundURL,
  testId: "graphiql-redirect",
}
```

Canonical implementations:

- `src/orders/components/OrderDetailsPage/OrderDetailsPage.tsx` + `src/orders/queries.ts` (`defaultGraphiQLQuery`)
- `src/products/components/ProductUpdatePage/ProductUpdatePage.tsx` + `src/products/queries.ts`

## Scope (direction A)

Only detail pages that **already render a `TopNav.Menu`**, so this is a pure
drop-in with no new UI surface. Nine pages:

| #   | Entity         | Page component                                                                   | Module `queries.ts`      |
| --- | -------------- | -------------------------------------------------------------------------------- | ------------------------ |
| 1   | Categories     | `categories/components/CategoryUpdatePage/CategoryUpdatePage.tsx`                | `categories/queries.ts`  |
| 2   | Collections    | `collections/components/CollectionDetailsPage/CollectionDetailsPage.tsx`         | `collections/queries.ts` |
| 3   | Customers      | `customers/components/CustomerDetailsPage/CustomerDetailsPage.tsx`               | `customers/queries.ts`   |
| 4   | Vouchers       | `discounts/components/VoucherDetailsPage/VoucherDetailsPage.tsx`                 | `discounts/queries.ts`   |
| 5   | Promotions     | `discounts/components/DiscountDetailsPage/DiscountDetailsPage.tsx`               | `discounts/queries.ts`   |
| 6   | Gift cards     | `giftCards/GiftCardUpdate/GiftCardUpdatePageHeader/GiftCardUpdatePageHeader.tsx` | `giftCards/queries.ts`   |
| 7   | Models (pages) | `modeling/components/PageDetailsPage/PageDetailsPage.tsx`                        | `modeling/queries.ts`    |
| 8   | Model types    | `modelTypes/components/PageTypeDetailsPage/PageTypeDetailsPage.tsx`              | `modelTypes/queries.ts`  |
| 9   | Menus          | `structures/components/MenuDetailsPage/MenuDetailsPage.tsx`                      | `structures/queries.ts`  |

### Explicitly out of scope

Detail pages without a kebab menu today (Warehouses, Product types, Attributes,
Channels, Staff, Permission groups, Shipping zone details, Product variant).
Adding the button there would require introducing a new `TopNav.Menu` — deferred.

## Prefilled queries (lean, intent — exact fields verified against schema during impl)

All key on `{ "id": "<entity-id>" }`.

| Entity         | Root field       | Lean query fields                    |
| -------------- | ---------------- | ------------------------------------ |
| Categories     | `category(id)`   | `id, name, slug`                     |
| Collections    | `collection(id)` | `id, name, slug`                     |
| Customers      | `user(id)`       | `id, email, firstName, lastName`     |
| Vouchers       | `voucher(id)`    | `id, name, type, discountValueType`  |
| Promotions     | `promotion(id)`  | `id, name, type, startDate, endDate` |
| Gift cards     | `giftCard(id)`   | `id, displayCode, isActive`          |
| Models (pages) | `page(id)`       | `id, title, slug, isPublished`       |
| Model types    | `pageType(id)`   | `id, name, slug`                     |
| Menus          | `menu(id)`       | `id, name, slug`                     |

Each query is a plain string export named `defaultGraphiQLQuery` (matching the
existing convention). Where a module already exports a `defaultGraphiQLQuery`
name collision is not expected (only orders/products/discounts use it; discounts
currently uses a hook `useGraphQLPlayground` with an inline `PromotionDetailsQuery`,
so a new lean export name may be chosen there to avoid ambiguity — see note).

### Note on the Discounts module

Promotions already have a "Open playground" affordance inside the rules editor
(`useGraphQLPlayground` → `PromotionDetailsQuery`). The new menu item on
`DiscountDetailsPage` (promotion detail) and `VoucherDetailsPage` is additive and
lives in the top-nav kebab. Reuse the existing promotion query where reasonable;
add a separate lean voucher query.

## Per-page implementation steps (repeated for each of the 9 pages)

1. Add a `defaultGraphiQLQuery` string export to the module's `queries.ts`
   (verify root field + field names against the generated schema/types).
2. Add an `openGraphiQL` entry to that page's `messages.ts`
   (label: _"Open this {entity} in GraphiQL"_, e.g. "Open this category in GraphiQL").
   Reuse an existing message if the module already has an equivalent.
3. In the page component:
   - import `useDevModeContext` from `@dashboard/components/DevModePanel/hooks`
   - import the module's `defaultGraphiQLQuery`
   - add `const context = useDevModeContext();`
   - add the `openPlaygroundURL` handler (content + variables + visibility)
4. Append the menu item to the existing `TopNav.Menu` `items` array with
   `testId: "graphiql-redirect"`.

## Verification

- `pnpm run lint` (with autofix) — must pass
- `pnpm run check-types` — must pass
- `pnpm run extract-messages` — run after adding new intl messages
- No manual click-through required (per decision).

## Non-goals / YAGNI

- No shared abstraction/hook extraction across pages in this PR — follow the
  existing copy-the-pattern convention to keep the diff reviewable and local.
  (A future refactor could extract a `useOpenInGraphiQL` hook.)
- No new kebab menus on pages that lack one.
