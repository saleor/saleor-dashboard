# Follow-up: Reuse spreadsheet paste beyond bulk publish

## Status

Partial extraction done:

| Piece                            | Location                                                                   |
| -------------------------------- | -------------------------------------------------------------------------- |
| Clipboard parse                  | `src/utils/spreadsheetPaste/parseSpreadsheetClipboard.ts`                  |
| Multi-field fill-down            | `src/utils/spreadsheetPaste/applySpreadsheetPaste.ts`                      |
| Single-column fill-down          | `src/utils/spreadsheetPaste/applySpreadsheetColumnPaste.ts` (thin wrapper) |
| Price sanitizing                 | `src/components/PriceFieldV2/utils.ts` (`sanitizeSpreadsheetPrice`)        |
| Integer sanitizing               | `src/utils/spreadsheetPaste/sanitizeSpreadsheetInteger.ts`                 |
| Multi-field bulk publish adapter | `bulkPublishSpreadsheetPaste.ts` (still owns multi-column map)             |

**Preferred money input:** `PriceFieldV2` — see [`saleor-dashboard-styles`](../../.claude/skills/saleor-dashboard-styles/SKILL.md#price-inputs-pricefieldv2--preferred).

## Consumers today

- Bulk publish review — multi-column paste (price / cost / stock) via local adapter
- Shipping method Order value — multi-column paste (min / max) via `applySpreadsheetPaste`
- Product variant pricing — multi-column paste (selling price / cost) via `applySpreadsheetPaste`
- Product variant stock list — single-column paste via `applySpreadsheetColumnPaste` + `sanitizeSpreadsheetInteger`
- Voucher fixed amount / Pricing / voucher min spent — single-column via `applySpreadsheetColumnPaste`

## Remaining work

Optionally refactor bulk publish to call `applySpreadsheetPaste` instead of its local grid walk.

### Where to wire next

1. **Product variants Datagrid** — `MoneyCell` / `NumberCell` paste sanitizers (`sanitizeSpreadsheetPrice` / integer)
2. Other row-list form UIs with aligned price columns — `applySpreadsheetPaste` / column helper

## Tests

- `applySpreadsheetPaste.test.ts`
- `applySpreadsheetColumnPaste.test.ts`
- Bulk-publish adapter tests (`bulkPublishSpreadsheetPaste.test.ts`)
- `PriceFieldV2` utils / hook tests
