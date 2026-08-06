import { parseSpreadsheetClipboard, trimEmptyTrailingRows } from "./parseSpreadsheetClipboard";

/**
 * Fill one or more fields down a list from spreadsheet paste.
 * Clipboard columns map onto `fields` in order (focused field first).
 * Extra pasted columns are ignored; empty/invalid cells are skipped.
 */
export const applySpreadsheetPaste = <T, F extends string>({
  rows,
  startRowIndex,
  fields,
  pastedText,
  sanitize,
  setField,
}: {
  rows: T[];
  startRowIndex: number;
  fields: readonly F[];
  pastedText: string;
  sanitize: (field: F, cell: string, row: T, rowIndex: number) => string | null;
  setField: (row: T, field: F, value: string) => T;
}): { rows: T[]; handled: boolean } => {
  const grid = trimEmptyTrailingRows(parseSpreadsheetClipboard(pastedText));

  if (
    grid.length === 0 ||
    fields.length === 0 ||
    startRowIndex < 0 ||
    startRowIndex >= rows.length
  ) {
    return { rows, handled: false };
  }

  const nextRows = [...rows];
  let handled = false;

  grid.forEach((pastedRow, rowOffset) => {
    const rowIndex = startRowIndex + rowOffset;

    if (rowIndex >= nextRows.length) {
      return;
    }

    pastedRow.forEach((cell, columnOffset) => {
      const field = fields[columnOffset];

      if (!field) {
        return;
      }

      const sanitized = sanitize(field, cell, nextRows[rowIndex], rowIndex);

      if (sanitized === null || sanitized === "") {
        return;
      }

      nextRows[rowIndex] = setField(nextRows[rowIndex], field, sanitized);
      handled = true;
    });
  });

  return { rows: nextRows, handled };
};
