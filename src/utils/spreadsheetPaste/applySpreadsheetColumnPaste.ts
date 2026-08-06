import { parseSpreadsheetClipboard, trimEmptyTrailingRows } from "./parseSpreadsheetClipboard";

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
}): { rows: T[]; handled: boolean } => {
  const grid = trimEmptyTrailingRows(parseSpreadsheetClipboard(pastedText));

  if (grid.length === 0 || startIndex < 0 || startIndex >= rows.length) {
    return { rows, handled: false };
  }

  const nextRows = [...rows];
  let handled = false;

  grid.forEach((row, rowOffset) => {
    const rowIndex = startIndex + rowOffset;

    if (rowIndex >= nextRows.length) {
      return;
    }

    const cell = row[0] ?? "";
    const sanitized = sanitizeCell(cell, nextRows[rowIndex], rowIndex);

    if (sanitized === null || sanitized === "") {
      return;
    }

    nextRows[rowIndex] = setCell(nextRows[rowIndex], sanitized);
    handled = true;
  });

  return { rows: nextRows, handled };
};
