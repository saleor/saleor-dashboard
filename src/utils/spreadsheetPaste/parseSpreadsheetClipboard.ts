/**
 * Parse tab/newline clipboard text from spreadsheets (Excel, Google Sheets, Numbers).
 * Rows are newline-separated; cells within a row are tab-separated.
 */
export const parseSpreadsheetClipboard = (text: string): string[][] => {
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trimEnd();

  if (normalized === "") {
    return [];
  }

  return normalized.split("\n").map(row => row.split("\t"));
};

export const trimEmptyTrailingRows = (grid: string[][]): string[][] => {
  const rows = [...grid];

  while (rows.length > 0 && rows[rows.length - 1].every(cell => cell.trim() === "")) {
    rows.pop();
  }

  return rows;
};
