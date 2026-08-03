# Select all in bulk publish product picker

**Implemented** in shared assign product picker (`selectAllMode: "when-scoped"`). Bulk publish passes `maxSelection: 50`. The collection product picker opts in too, without a cap.

## Behavior (v0)

- Shown only when **filters or search** narrow the list (hidden on unfiltered catalog).
- **Select all visible products** toggles every loaded, selectable row.
- **Scroll to load more products.** hint when `hasMore`.
- Stops at wizard cap (50); warning notification if visible rows were skipped.

## Future (optional v2)

- Auto-fetch pages until `min(matchingCount, 50)` instead of visible-only selection.
- Dedicated “Add collection to channel” action.

## Related

- `src/components/AssignProductDialog/useAssignProductPicker.ts`
- `src/components/AssignProductDialog/AssignProductPickerSelectAll.tsx`
- `src/channels/components/BulkPublishToChannelDialog/BulkPublishToChannelDialog.tsx`
