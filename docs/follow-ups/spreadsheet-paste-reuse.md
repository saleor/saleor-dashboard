# Follow-up: Reuse spreadsheet paste beyond bulk publish

## Status

Partial extraction done:

| Piece                            | Location                                                                                |
| -------------------------------- | --------------------------------------------------------------------------------------- |
| Clipboard parse                  | `src/utils/spreadsheetPaste/parseSpreadsheetClipboard.ts`                               |
| Single-column fill-down          | `src/utils/spreadsheetPaste/applySpreadsheetColumnPaste.ts`                             |
| Price sanitizing                 | `src/components/PriceFieldV2/utils.ts` (`sanitizeSpreadsheetPrice`)                     |
| Multi-field bulk publish adapter | `bulkPublishSpreadsheetPaste.ts` (still owns stock integer sanitize + multi-column map) |

**Preferred money input:** `PriceFieldV2` — see [`saleor-dashboard-styles`](../../.claude/skills/saleor-dashboard-styles/SKILL.md#price-inputs-pricefieldv2--preferred).

## Consumers today

- Bulk publish review — multi-column paste (price / cost / stock)
- Voucher fixed amount per channel — single-column paste via `applySpreadsheetColumnPaste`

## Remaining work

```
src/utils/spreadsheetPaste/
  sanitizeSpreadsheetInteger.ts     # move from bulk publish
  applySpreadsheetPaste.ts          # generic multi-field map (bulk publish shape)
```

Generic multi-field API sketch:

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

### Where to wire next

1. **Product variants Datagrid** — `MoneyCell` / `NumberCell` paste sanitizers (`sanitizeSpreadsheetPrice` / integer)
2. Other row-list form UIs with aligned price columns — `applySpreadsheetColumnPaste` or multi-field helper
3. Single-field forms — `PriceFieldV2` alone is enough; no spreadsheet util unless multi-row columns exist

## Tests

- `applySpreadsheetColumnPaste.test.ts`
- Bulk-publish adapter tests (`bulkPublishSpreadsheetPaste.test.ts`)
- `PriceFieldV2` utils / hook tests
