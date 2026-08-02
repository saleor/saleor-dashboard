# Follow-up: Reuse spreadsheet paste beyond bulk publish

Tracked for a **future PR** (not part of the bulk-publish / `PriceFieldV2` pilot).

## Context

Bulk publish review step uses TSV paste fill-down/across for price, cost price, and stock:

- `src/channels/components/BulkPublishToChannelDialog/bulkPublishSpreadsheetPaste.ts`
- `onPasteCapture` on row inputs in `BulkPublishReviewStep.tsx`

Price sanitizing already lives in `src/components/PriceFieldV2/utils.ts` (`sanitizeSpreadsheetPrice`, `padPriceToDecimalPlaces`). Stock integer sanitizing is still in the bulk-publish file (`sanitizeSpreadsheetInteger`).

## What to extract (generic layer)

```
src/utils/spreadsheetPaste/
  parseSpreadsheetClipboard.ts      # move from bulk publish
  sanitizeSpreadsheetInteger.ts     # move from bulk publish (or colocate with PriceFieldV2 utils)
  applySpreadsheetPaste.ts          # generic rows[] + field order + sanitizer map

channels/.../bulkPublishSpreadsheetPaste.ts  # thin adapter for ProductPublishDraft
```

Generic API sketch:

```typescript
applySpreadsheetPaste<T>({
  rows: T[],
  startRowIndex: number,
  fields: string[], // columns from focused field onward
  pastedText: string,
  sanitize: (field, cell) => string | null,
  setField: (row, field, value) => T,
}): { rows: T[]; handled: boolean };
```

Plus a small `handleSpreadsheetFieldPaste` helper for `onPasteCapture` on form inputs.

## Where to wire it

### 1. Product variants Datagrid (highest impact)

Glide Data Grid already handles multi-cell paste. Per-cell `onPaste` in custom renderers only needs better sanitizers — **not** the full `applySpreadsheetPaste` grid logic.

| Cell         | File                                                      | Today               | Change                                      |
| ------------ | --------------------------------------------------------- | ------------------- | ------------------------------------------- |
| Price / cost | `src/components/Datagrid/customCells/Money/MoneyCell.tsx` | `parseFloat(value)` | `sanitizeSpreadsheetPrice(value, currency)` |
| Stock qty    | `src/components/Datagrid/customCells/NumberCell.tsx`      | basic regex         | `sanitizeSpreadsheetInteger(value)`         |

Consider pairing with `PriceFieldV2` / `usePriceFieldV2` in `MoneyCellEdit` when migrating off legacy `PriceField`.

### 2. Other row-list form UIs

Any future UI with aligned price/stock columns (same pattern as bulk publish review) should use the generic `applySpreadsheetPaste` + `onPasteCapture` wrapper.

### 3. Single-field forms (low value)

Variant pricing page, orders, gift cards — normal input paste + `formatPriceInput` is enough. No spreadsheet util needed unless multiple columns are added.

## Tests to move/add

- Move `parseSpreadsheetClipboard` / integer sanitizer tests to generic module.
- Keep bulk-publish adapter tests thin (draft shape + field order only).
- Add/update `MoneyCell` / `NumberCell` paste tests for EU/US formats and currency padding.

## Related

- `PriceFieldV2` pilot: `src/components/PriceFieldV2/`
- Datagrid skill: `.claude/skills/saleor-dashboard-datagrid/SKILL.md`
