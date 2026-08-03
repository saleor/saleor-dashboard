# Client-side exclusion in assign pickers

`ProductWhereInput` (and several other filter inputs) cannot express "not already assigned" —
`GlobalIdFilterInput` only has `eq` and `oneOf`, and there is no top-level `NOT`. So pickers that
hide already-assigned rows have to filter the fetched page on the client, which breaks pagination:
a page that is fully filtered away leaves nothing to scroll, and the infinite scroller only asks
for the next page on scroll. The picker dead-ends on "No … found" with pages still available, and
it gets worse the more items get assigned.

## The pattern that works

Hand the picker the **raw** search results plus an `excludeProduct` / `excludeContainer`
predicate. Filtering inside the picker is what lets it tell "this page was filtered down to
nothing" apart from "the catalog is empty", so it can pull the next page in on the list's behalf.

```tsx
<AssignProductDialog
  products={searchedProducts} // raw, unfiltered
  excludeProduct={isAssignedToThisCollection}
  selectAllMode="when-scoped"
  backfillResetKey={String(searchGeneration)}
/>

<AssignCategoryDialog
  categories={searchedCategories}
  excludeContainer={isCategoryAssigned}
  backfillResetKey={String(searchGeneration)}
/>
```

Filtering _before_ the list prop (`products={excludeAssigned(results)}`) is the broken shape.

Also raise the search page size for product pickers — a page of 20 is easily consumed by
exclusion on a large catalog.

## Done

- Collection products (`CollectionProducts.tsx`)
- Voucher details / create: products, categories, collections
- Product stocks → warehouses
- Reference attribute values (products, models, categories, collections)
- Order product add (filters products with no priced variant in the order's channel)
- Shared backfill in `AssignContainerDialog` + `usePickerBackfill`

## Remaining

**Terminal empty state still uses the generic copy.** Exclusion-aware pickers distinguish two
cases, not three: `getPickerBackfillStatus` reports neither backfilling nor exhausted once
`hasMore` is false, so a list that was loaded to the end and fully excluded falls through to the
plain `emptyMessage`. A voucher that already has every product says "No products found" — the
same lie the backfill work set out to kill, at the end of the list instead of the start, and
with no Load more button to hint otherwise. The third state ("rows returned, all excluded, no
more pages") wants its own message per picker, e.g. "No products left to assign." / "No
warehouses left to add." / "None of these products have a price in this channel." Phrase it
scoped to the current list rather than the catalog, so it stays true while a search narrows
things down.

Voucher details reads the assigned-id set from `VoucherAssignedIds`, capped at 100 per list.
Past that cap exclusion goes partial again — an already-assigned row can reappear in the picker.
That is recoverable (re-assigning is a no-op), unlike the empty picker it replaced. Closing it
fully means paginating three independent cursors in that query.

## Related

- `src/hooks/pickerBackfill.ts` — budget, dead-end detection
- `src/hooks/usePickerBackfill.ts`
- `src/components/AssignPickerBackfillExhausted/AssignPickerBackfillExhausted.tsx`
