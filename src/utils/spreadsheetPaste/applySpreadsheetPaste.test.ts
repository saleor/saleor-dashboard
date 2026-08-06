import { applySpreadsheetPaste } from "./applySpreadsheetPaste";

describe("applySpreadsheetPaste", () => {
  it("fills multiple fields from a multi-column paste starting at the focused field", () => {
    // Arrange
    const rows = [
      { minValue: "", maxValue: "" },
      { minValue: "", maxValue: "" },
    ];

    // Act
    const result = applySpreadsheetPaste({
      rows,
      startRowIndex: 0,
      fields: ["minValue", "maxValue"] as const,
      pastedText: "10\t20\n30\t40",
      sanitize: (_field, cell) => cell.trim(),
      setField: (row, field, value) => ({ ...row, [field]: value }),
    });

    // Assert
    expect(result.handled).toBe(true);
    expect(result.rows).toEqual([
      { minValue: "10", maxValue: "20" },
      { minValue: "30", maxValue: "40" },
    ]);
  });

  it("maps columns from the focused field onward when paste starts mid-row", () => {
    // Arrange
    const rows = [{ minValue: "1", maxValue: "" }];

    // Act
    const result = applySpreadsheetPaste({
      rows,
      startRowIndex: 0,
      fields: ["maxValue"] as const,
      pastedText: "99\tignored",
      sanitize: (_field, cell) => cell.trim(),
      setField: (row, field, value) => ({ ...row, [field]: value }),
    });

    // Assert
    expect(result.rows).toEqual([{ minValue: "1", maxValue: "99" }]);
  });

  it("skips empty and invalid cells without clearing existing values", () => {
    // Arrange
    const rows = [{ minValue: "5", maxValue: "9" }];

    // Act
    const result = applySpreadsheetPaste({
      rows,
      startRowIndex: 0,
      fields: ["minValue", "maxValue"] as const,
      pastedText: "\tinvalid",
      sanitize: (_field, cell) => {
        const trimmed = cell.trim();

        if (trimmed === "") {
          return "";
        }

        if (trimmed === "invalid") {
          return null;
        }

        return trimmed;
      },
      setField: (row, field, value) => ({ ...row, [field]: value }),
    });

    // Assert
    expect(result.handled).toBe(false);
    expect(result.rows).toEqual([{ minValue: "5", maxValue: "9" }]);
  });
});
