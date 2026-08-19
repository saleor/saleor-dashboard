import { applySpreadsheetPaste } from "./applySpreadsheetPaste";

/**
 * Fill a single column down a list from spreadsheet paste (one value per row).
 * Uses the first cell of each pasted row. Multi-column pastes ignore extra columns.
 *
 * `sanitizeCell` should return `null` to skip invalid cells, `""` for empty.
 */
export const applySpreadsheetColumnPaste = <T>({
  rows,
  startIndex,
  pastedText,
  sanitizeCell,
  setCell,
}: {
  rows: T[];
  startIndex: number;
  pastedText: string;
  sanitizeCell: (cell: string, row: T, rowIndex: number) => string | null;
  setCell: (row: T, value: string) => T;
}): { rows: T[]; handled: boolean } =>
  applySpreadsheetPaste({
    rows,
    startRowIndex: startIndex,
    fields: ["value"] as const,
    pastedText,
    sanitize: (_field, cell, row, rowIndex) => sanitizeCell(cell, row, rowIndex),
    setField: (row, _field, value) => setCell(row, value),
  });
