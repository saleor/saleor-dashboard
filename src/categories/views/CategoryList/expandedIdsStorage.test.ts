import {
  normalizeStoredExpandedIds,
  serializeExpandedIds,
} from "@dashboard/categories/views/CategoryList/expandedIdsStorage";

describe("expandedIdsStorage", () => {
  it("should normalize stored ids to unique string values", () => {
    // Arrange
    const storedValue: unknown = ["cat-2", 10, "cat-1", "cat-2", null];

    // Act
    const result = normalizeStoredExpandedIds(storedValue);

    // Assert
    expect(result).toEqual(["cat-2", "cat-1"]);
  });

  it("should return empty array for invalid storage payload", () => {
    // Arrange
    const storedValue: unknown = { ids: ["cat-1"] };

    // Act
    const result = normalizeStoredExpandedIds(storedValue);

    // Assert
    expect(result).toEqual([]);
  });

  it("should serialize expanded ids as sorted array", () => {
    // Arrange
    const expandedIds = new Set(["cat-3", "cat-1", "cat-2"]);

    // Act
    const result = serializeExpandedIds(expandedIds);

    // Assert
    expect(result).toEqual(["cat-1", "cat-2", "cat-3"]);
  });
});
