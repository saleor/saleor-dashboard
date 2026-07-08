import { mergeProductAssignedTypeUsage } from "./mergeProductAssignedTypeUsage";

describe("mergeProductAssignedTypeUsage", () => {
  it("should merge product and variant assignments by type id", () => {
    // Arrange
    const productTypes = {
      items: [
        { id: "1", name: "Top" },
        { id: "2", name: "Sweatshirt" },
      ],
      hasMore: false,
    };
    const variantTypes = {
      items: [
        { id: "2", name: "Sweatshirt" },
        { id: "3", name: "Shoes" },
      ],
      hasMore: true,
    };

    // Act
    const result = mergeProductAssignedTypeUsage(productTypes, variantTypes);

    // Assert
    expect(result.productTypeCount).toBe(2);
    expect(result.variantTypeCount).toBe(2);
    expect(result.hasMore).toBe(true);
    expect(result.types).toEqual([
      { id: "3", name: "Shoes", roles: ["variant"] },
      { id: "2", name: "Sweatshirt", roles: ["product", "variant"] },
      { id: "1", name: "Top", roles: ["product"] },
    ]);
  });
});
