import { getInternalDescriptionChange, normalizeInternalDescription } from "./internalDescription";

describe("normalizeInternalDescription", () => {
  it.each([
    ["", null],
    ["   \n\t ", null],
    [null, null],
    [undefined, null],
  ])("sends null for empty value %j", (value, expected) => {
    // Arrange & Act
    const normalized = normalizeInternalDescription(value);

    // Assert
    expect(normalized).toBe(expected);
  });

  it("keeps non-empty text exactly as typed", () => {
    // Arrange
    const value = "  Fabric weight in grams.\nRound to whole numbers.  ";

    // Act
    const normalized = normalizeInternalDescription(value);

    // Assert
    expect(normalized).toBe(value);
  });
});

describe("getInternalDescriptionChange", () => {
  it.each<[string | null | undefined, string, ReturnType<typeof getInternalDescriptionChange>]>([
    [null, "Text", "added"],
    [undefined, "Text", "added"],
    ["", "Text", "added"],
    ["Text", "Other text", "changed"],
    ["Text", "", "removed"],
    ["Text", "   ", "removed"],
    ["Text", "Text", null],
    [null, "", null],
    ["", "  ", null],
  ])("from %j to %j is %j", (previous, next, expected) => {
    // Arrange & Act
    const change = getInternalDescriptionChange(previous, next);

    // Assert
    expect(change).toBe(expected);
  });
});
