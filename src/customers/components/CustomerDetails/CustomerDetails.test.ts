import { formatMonthYear } from "./CustomerDetails";

describe("formatMonthYear", () => {
  it("formats date as abbreviated month and year", () => {
    // Arrange & Act
    const result = formatMonthYear("en-US")("2024-01-15T14:30:00Z");

    // Assert
    expect(result).toBe("Jan 2024");
  });

  it("formats mid-year date correctly", () => {
    // Arrange & Act
    const result = formatMonthYear("en-US")("2024-06-01T00:00:00Z");

    // Assert
    expect(result).toBe("Jun 2024");
  });

  it("formats end-of-year date correctly", () => {
    // Arrange & Act
    const result = formatMonthYear("en-US")("2023-12-31T23:59:59Z");

    // Assert
    expect(result).toBe("Dec 2023");
  });
});
