import { parsePastedAttributeValues } from "./parsePastedAttributeValues";

describe("parsePastedAttributeValues", () => {
  it("splits comma-separated values and trims whitespace", () => {
    // Arrange & Act
    const values = parsePastedAttributeValues("Italy, France, Germany");

    // Assert
    expect(values).toEqual(["Italy", "France", "Germany"]);
  });

  it("splits spreadsheet columns and rows", () => {
    // Arrange & Act
    const values = parsePastedAttributeValues("Italy\nFrance\tGermany");

    // Assert
    expect(values).toEqual(["Italy", "France", "Germany"]);
  });

  it("keeps a single name that contains spaces", () => {
    // Arrange & Act
    const values = parsePastedAttributeValues("United States");

    // Assert
    expect(values).toEqual(["United States"]);
  });

  it("drops empties and duplicates from the paste", () => {
    // Arrange & Act
    const values = parsePastedAttributeValues("Italy,, Italy; France");

    // Assert
    expect(values).toEqual(["Italy", "France"]);
  });
});
