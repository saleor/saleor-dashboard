# Client-side exclusion in assign product pickers

`ProductWhereInput` cannot express "not in collection/voucher X" — `GlobalIdFilterInput` only has
`eq` and `oneOf`, and there is no top-level `NOT`. So pickers that hide already-assigned products
have to filter the fetched page on the client, which breaks pagination: a page that is fully
filtered away leaves nothing to scroll, and the infinite scroller only asks for the next page on
scroll. The picker dead-ends on "No products found" with pages still available, and it gets worse
the more products get assigned.

## The pattern that works

Hand the picker the **raw** search results plus an `excludeProduct` predicate. Filtering inside
the picker is what lets it tell "this page was filtered down to nothing" apart from "the catalog
is empty", so it can pull the next page in on the list's behalf.

```tsx
<AssignProductDialog
  products={searchedProducts} // raw, unfiltered
  excludeProduct={isAssignedToThisCollection}
  selectAllMode="when-scoped"
  backfillResetKey={String(searchGeneration)}
/>
```

Filtering _before_ `products` (`products={excludeAssigned(results)}`) is the broken shape.

Also raise the search page size — a page of 20 is easily consumed by exclusion on a large catalog.

## Done

- Collection products (`CollectionProducts.tsx`).

## Remaining

Voucher product pickers still pre-filter, so they can dead-end the same way:

- `getFilteredProducts` in `src/discounts/utils.ts` (voucher details). Note it excludes only the
  **currently loaded page** of assigned products, so the exclusion is already partial — worth
  deciding whether it should exclude at all, or just disable assigned rows via `selectedIds`
  (what `getFilteredProductVariants` does).
- `getFilteredProducts` in `src/discounts/components/VoucherCreatePage/utils.ts` (voucher create).
  Excludes against unsaved form state, so the set is small and bounded.

Shipping rate product assignment does not exclude anything, so it is unaffected.

## Related

- `src/components/AssignProductDialog/pickerBackfill.ts` — budget, dead-end detection.
- `src/components/AssignProductDialog/usePickerBackfill.ts`
- `src/components/AssignProductDialog/AssignProductPickerBackfillExhausted.tsx` — the explicit
  "Load more products" way out when the automatic budget is spent.
