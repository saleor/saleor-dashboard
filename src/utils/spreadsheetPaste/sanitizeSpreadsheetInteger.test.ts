import { sanitizeSpreadsheetInteger } from "./sanitizeSpreadsheetInteger";

describe("sanitizeSpreadsheetInteger", () => {
  it("truncates spreadsheet decimals for stock values", () => {
    // Arrange
    // Act & Assert
    expect(sanitizeSpreadsheetInteger("12.9")).toBe("12");
    expect(sanitizeSpreadsheetInteger("")).toBe("");
  });

  it("rejects negative values", () => {
    // Arrange
    // Act & Assert
    expect(sanitizeSpreadsheetInteger("-5")).toBeNull();
  });
});
