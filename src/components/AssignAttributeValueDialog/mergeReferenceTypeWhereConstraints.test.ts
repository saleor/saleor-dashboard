import {
  filterProductsByReferenceTypeConstraints,
  getReferencePickerLoadingState,
  getReferenceWhereConstraints,
  hasReferenceTypeConstraints,
  mergePageReferenceWhereConstraints,
  mergeProductReferenceWhereConstraints,
} from "./mergeReferenceTypeWhereConstraints";

describe("mergeReferenceTypeWhereConstraints", () => {
  describe("mergeProductReferenceWhereConstraints", () => {
    it("should apply product type restriction when where is empty", () => {
      // Arrange
      const productTypeIds = ["pt-1"];

      // Act
      const result = mergeProductReferenceWhereConstraints({}, productTypeIds);

      // Assert
      expect(result).toEqual({ productType: { oneOf: ["pt-1"] } });
    });

    it("should preserve existing where filters when applying product type restriction", () => {
      // Arrange
      const where = { ids: ["prod-1"] };

      // Act
      const result = mergeProductReferenceWhereConstraints(where, ["pt-1"]);

      // Assert
      expect(result).toEqual({
        ids: ["prod-1"],
        productType: { oneOf: ["pt-1"] },
      });
    });

    it("should return where unchanged when no product type ids are provided", () => {
      // Arrange
      const where = { ids: ["prod-1"] };

      // Act
      const result = mergeProductReferenceWhereConstraints(where, undefined);

      // Assert
      expect(result).toEqual(where);
    });
  });

  describe("mergePageReferenceWhereConstraints", () => {
    it("should apply page type restriction when where is empty", () => {
      // Arrange
      const pageTypeIds = ["page-type-1"];

      // Act
      const result = mergePageReferenceWhereConstraints(undefined, pageTypeIds);

      // Assert
      expect(result).toEqual({ pageType: { oneOf: ["page-type-1"] } });
    });
  });

  describe("getReferenceWhereConstraints", () => {
    it("should extract ids from initial constraints", () => {
      // Act
      const result = getReferenceWhereConstraints({
        productTypes: [{ id: "pt-1", name: "Simple" }],
        pageTypes: [{ id: "pgt-1", name: "Blog" }],
      });

      // Assert
      expect(result).toEqual({
        productTypeIds: ["pt-1"],
        pageTypeIds: ["pgt-1"],
      });
    });
  });

  describe("hasReferenceTypeConstraints", () => {
    it("should return true when product types are constrained", () => {
      // Assert
      expect(
        hasReferenceTypeConstraints({
          productTypes: [{ id: "pt-1", name: "Simple" }],
        }),
      ).toBe(true);
    });

    it("should return false when no constraints exist", () => {
      // Assert
      expect(hasReferenceTypeConstraints(undefined)).toBe(false);
    });
  });

  describe("filterProductsByReferenceTypeConstraints", () => {
    it("should keep only products whose type is allowed", () => {
      // Arrange
      const products = [
        { id: "p-1", name: "Gift", productType: { id: "pt-gift", name: "Gift Card" } },
        { id: "p-2", name: "Juice", productType: { id: "pt-juice", name: "Juice" } },
      ];

      // Act
      const result = filterProductsByReferenceTypeConstraints(products, {
        productTypes: [{ id: "pt-gift", name: "Gift Card" }],
      });

      // Assert
      expect(result).toEqual([products[0]]);
    });
  });

  describe("getReferencePickerLoadingState", () => {
    it("should stay loading while stale results include disallowed product types", () => {
      // Arrange
      const products = [
        { id: "p-1", productType: { id: "pt-juice" } },
        { id: "p-2", productType: { id: "pt-gift" } },
      ];

      // Act
      const result = getReferencePickerLoadingState(
        false,
        {
          productTypes: [{ id: "pt-gift", name: "Gift Card" }],
        },
        products,
      );

      // Assert
      expect(result).toBe(true);
    });

    it("should not force loading when every product matches the constraint", () => {
      // Arrange
      const products = [{ id: "p-1", productType: { id: "pt-gift" } }];

      // Act
      const result = getReferencePickerLoadingState(
        false,
        {
          productTypes: [{ id: "pt-gift", name: "Gift Card" }],
        },
        products,
      );

      // Assert
      expect(result).toBe(false);
    });
  });
});
