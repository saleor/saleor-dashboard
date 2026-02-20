import { GrantRefundInputLine, squashLines } from "./useRefundWithinReturn";

describe("squashLines", () => {
  it("merges items with the same ID", () => {
    const items = [
      { id: "abc", quantity: 1 },
      { id: "def", quantity: 2 },
      { id: "abc", quantity: 3 },
    ];
    const result = squashLines(items);

    expect(result).toEqual([
      { id: "abc", quantity: 4 },
      { id: "def", quantity: 2 },
    ]);
  });
  it("handles an empty array", () => {
    const items = [] as GrantRefundInputLine[];
    const result = squashLines(items);

    expect(result).toEqual([]);
  });
  it("does not modify items with unique IDs", () => {
    const items = [
      { id: "abc", quantity: 1 },
      { id: "def", quantity: 2 },
    ];
    const result = squashLines(items);

    expect(result).toEqual(items);
  });
  it("preserves reason fields when merging, keeping first non-empty value", () => {
    // Arrange
    const items: GrantRefundInputLine[] = [
      { id: "abc", quantity: 1, reason: "damaged", reasonReference: "ref-1" },
      { id: "abc", quantity: 2, reason: "wrong size", reasonReference: "ref-2" },
    ];

    // Act
    const result = squashLines(items);

    // Assert
    expect(result).toEqual([
      { id: "abc", quantity: 3, reason: "damaged", reasonReference: "ref-1" },
    ]);
  });
  it("falls back to second item's reason when first is empty", () => {
    // Arrange
    const items: GrantRefundInputLine[] = [
      { id: "abc", quantity: 1 },
      { id: "abc", quantity: 2, reason: "damaged", reasonReference: "ref-1" },
    ];

    // Act
    const result = squashLines(items);

    // Assert
    expect(result).toEqual([
      { id: "abc", quantity: 3, reason: "damaged", reasonReference: "ref-1" },
    ]);
  });
});
