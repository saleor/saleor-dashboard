import { countUniqueAttributeIds } from "@dashboard/attributes/utils/countUniqueAttributeIds";

describe("countUniqueAttributeIds", () => {
  it("should count unique ids across attribute lists", () => {
    // Arrange
    const productAttributes = [{ id: "a-1" }, { id: "a-2" }];
    const variantAttributes = [{ id: "a-3" }];

    // Act
    const result = countUniqueAttributeIds([productAttributes, variantAttributes]);

    // Assert
    expect(result).toBe(3);
  });

  it("should dedupe ids shared between attribute lists", () => {
    // Arrange
    const productAttributes = [{ id: "a-1" }, { id: "a-2" }];
    const variantAttributes = [{ id: "a-2" }, { id: "a-3" }];

    // Act
    const result = countUniqueAttributeIds([productAttributes, variantAttributes]);

    // Assert
    expect(result).toBe(3);
  });
});
