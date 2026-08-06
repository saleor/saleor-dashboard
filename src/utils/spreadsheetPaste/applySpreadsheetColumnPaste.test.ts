import { applySpreadsheetColumnPaste } from "./applySpreadsheetColumnPaste";

describe("applySpreadsheetColumnPaste", () => {
  it("fills a column down from the start index", () => {
    // Arrange
    const rows = [{ value: "" }, { value: "" }, { value: "" }];

    // Act
    const result = applySpreadsheetColumnPaste({
      rows,
      startIndex: 0,
      pastedText: "10\n20\n30",
      sanitizeCell: cell => cell.trim(),
      setCell: (row, value) => ({ ...row, value }),
    });

    // Assert
    expect(result.handled).toBe(true);
    expect(result.rows.map(row => row.value)).toEqual(["10", "20", "30"]);
  });

  it("uses only the first column of a multi-column paste", () => {
    // Arrange
    const rows = [{ value: "" }, { value: "" }];

    // Act
    const result = applySpreadsheetColumnPaste({
      rows,
      startIndex: 0,
      pastedText: "10\t99\n20\t88",
      sanitizeCell: cell => cell.trim(),
      setCell: (row, value) => ({ ...row, value }),
    });

    // Assert
    expect(result.rows.map(row => row.value)).toEqual(["10", "20"]);
  });

  it("skips invalid cells and does not mark handled when nothing applies", () => {
    // Arrange
    const rows = [{ value: "1" }];

    // Act
    const result = applySpreadsheetColumnPaste({
      rows,
      startIndex: 0,
      pastedText: "invalid",
      sanitizeCell: () => null,
      setCell: (row, value) => ({ ...row, value }),
    });

    // Assert
    expect(result.handled).toBe(false);
    expect(result.rows).toEqual(rows);
  });
});
