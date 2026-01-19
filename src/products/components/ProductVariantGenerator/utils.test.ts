import { AttributeInputTypeEnum } from "@dashboard/graphql";

import { AttributeData, ExistingVariantData, GeneratorDefaults, SelectionState } from "./types";
import {
  cartesianProduct,
  extractExistingCombinations,
  generateVariantPreviews,
  toBulkCreateInputs,
} from "./utils";

describe("ProductVariantGenerator utils", () => {
  describe("cartesianProduct", () => {
    it("returns empty combination for empty input", () => {
      // Arrange
      const input: string[][] = [];

      // Act
      const result = cartesianProduct(input);

      // Assert
      expect(result).toEqual([[]]);
    });

    it("returns single array items wrapped in arrays", () => {
      // Arrange
      const input = [["a", "b"]];

      // Act
      const result = cartesianProduct(input);

      // Assert
      expect(result).toEqual([["a"], ["b"]]);
    });

    it("computes cartesian product of two arrays", () => {
      // Arrange
      const input = [
        ["S", "M"],
        ["Red", "Blue"],
      ];

      // Act
      const result = cartesianProduct(input);

      // Assert
      expect(result).toEqual([
        ["S", "Red"],
        ["S", "Blue"],
        ["M", "Red"],
        ["M", "Blue"],
      ]);
    });

    it("computes cartesian product of three arrays", () => {
      // Arrange
      const input = [["S", "M"], ["Red"], ["Cotton", "Polyester"]];

      // Act
      const result = cartesianProduct(input);

      // Assert
      expect(result).toEqual([
        ["S", "Red", "Cotton"],
        ["S", "Red", "Polyester"],
        ["M", "Red", "Cotton"],
        ["M", "Red", "Polyester"],
      ]);
    });
  });

  describe("extractExistingCombinations", () => {
    it("returns empty array for no existing variants", () => {
      // Arrange
      const existingVariants: ExistingVariantData = [];

      // Act
      const result = extractExistingCombinations(existingVariants);

      // Assert
      expect(result).toEqual([]);
    });

    it("extracts attribute combinations from existing variants", () => {
      // Arrange
      const existingVariants: ExistingVariantData = [
        {
          attributes: [
            { attribute: { id: "size" }, values: [{ slug: "small" }] },
            { attribute: { id: "color" }, values: [{ slug: "red" }] },
          ],
        },
        {
          attributes: [
            { attribute: { id: "size" }, values: [{ slug: "medium" }] },
            { attribute: { id: "color" }, values: [{ slug: "blue" }] },
          ],
        },
      ];

      // Act
      const result = extractExistingCombinations(existingVariants);

      // Assert
      expect(result).toEqual([
        [
          { attributeId: "size", valueSlug: "small" },
          { attributeId: "color", valueSlug: "red" },
        ],
        [
          { attributeId: "size", valueSlug: "medium" },
          { attributeId: "color", valueSlug: "blue" },
        ],
      ]);
    });
  });

  describe("generateVariantPreviews", () => {
    const createAttributes = (): AttributeData[] => [
      {
        id: "size",
        name: "Size",
        slug: "size",
        inputType: AttributeInputTypeEnum.DROPDOWN,
        values: [
          { id: "s", name: "Small", slug: "small" },
          { id: "m", name: "Medium", slug: "medium" },
        ],
      },
      {
        id: "color",
        name: "Color",
        slug: "color",
        inputType: AttributeInputTypeEnum.DROPDOWN,
        values: [
          { id: "r", name: "Red", slug: "red" },
          { id: "b", name: "Blue", slug: "blue" },
        ],
      },
    ];

    it("returns empty array when no values selected", () => {
      // Arrange
      const attributes = createAttributes();
      const selections: SelectionState = {
        size: new Set(),
        color: new Set(),
      };

      // Act
      const result = generateVariantPreviews(attributes, selections, []);

      // Assert
      expect(result).toEqual([]);
    });

    it("returns empty array when only some attributes have selections", () => {
      // Arrange
      const attributes = createAttributes();
      const selections: SelectionState = {
        size: new Set(["s"]),
        color: new Set(), // No color selected
      };

      // Act
      const result = generateVariantPreviews(attributes, selections, []);

      // Assert
      expect(result).toEqual([]);
    });

    it("generates previews for all combinations", () => {
      // Arrange
      const attributes = createAttributes();
      const selections: SelectionState = {
        size: new Set(["s", "m"]),
        color: new Set(["r"]),
      };

      // Act
      const result = generateVariantPreviews(attributes, selections, []);

      // Assert
      expect(result).toHaveLength(2);
      expect(result).toEqual([
        {
          name: "Small / Red",
          attributes: [
            { attributeName: "Size", valueName: "Small" },
            { attributeName: "Color", valueName: "Red" },
          ],
          isExisting: false,
        },
        {
          name: "Medium / Red",
          attributes: [
            { attributeName: "Size", valueName: "Medium" },
            { attributeName: "Color", valueName: "Red" },
          ],
          isExisting: false,
        },
      ]);
    });

    it("marks existing combinations as isExisting: true", () => {
      // Arrange
      const attributes = createAttributes();
      const selections: SelectionState = {
        size: new Set(["s", "m"]),
        color: new Set(["r"]),
      };
      const existingCombinations = [
        [
          { attributeId: "size", valueSlug: "small" },
          { attributeId: "color", valueSlug: "red" },
        ],
      ];

      // Act
      const result = generateVariantPreviews(attributes, selections, existingCombinations);

      // Assert
      expect(result[0].isExisting).toBe(true); // Small / Red exists
      expect(result[1].isExisting).toBe(false); // Medium / Red is new
    });
  });

  describe("toBulkCreateInputs", () => {
    const createAttributes = (): AttributeData[] => [
      {
        id: "size",
        name: "Size",
        slug: "size",
        inputType: AttributeInputTypeEnum.DROPDOWN,
        values: [
          { id: "s", name: "Small", slug: "small" },
          { id: "m", name: "Medium", slug: "medium" },
        ],
      },
      {
        id: "color",
        name: "Color",
        slug: "color",
        inputType: AttributeInputTypeEnum.DROPDOWN,
        values: [
          { id: "r", name: "Red", slug: "red" },
          { id: "b", name: "Blue", slug: "blue" },
        ],
      },
    ];

    const createDefaults = (overrides?: Partial<GeneratorDefaults>): GeneratorDefaults => ({
      stockEnabled: false,
      stockQuantity: "",
      skuEnabled: false,
      skuPrefix: "",
      ...overrides,
    });

    it("returns empty array when no values selected", () => {
      // Arrange
      const attributes = createAttributes();
      const selections: SelectionState = {
        size: new Set(),
        color: new Set(),
      };

      // Act
      const result = toBulkCreateInputs(attributes, selections, createDefaults(), [], []);

      // Assert
      expect(result).toEqual([]);
    });

    it("generates inputs for new combinations only", () => {
      // Arrange
      const attributes = createAttributes();
      const selections: SelectionState = {
        size: new Set(["s", "m"]),
        color: new Set(["r"]),
      };
      const existingCombinations = [
        [
          { attributeId: "size", valueSlug: "small" },
          { attributeId: "color", valueSlug: "red" },
        ],
      ];

      // Act
      const result = toBulkCreateInputs(
        attributes,
        selections,
        createDefaults(),
        [],
        existingCombinations,
      );

      // Assert - Small/Red is skipped because it exists
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Medium / Red");
    });

    it("includes stock when stockEnabled and quantity provided", () => {
      // Arrange
      const attributes = createAttributes();
      const selections: SelectionState = {
        size: new Set(["s"]),
        color: new Set(["r"]),
      };
      const warehouses = [{ id: "wh1" }, { id: "wh2" }];
      const defaults = createDefaults({
        stockEnabled: true,
        stockQuantity: "10",
      });

      // Act
      const result = toBulkCreateInputs(attributes, selections, defaults, warehouses, []);

      // Assert
      expect(result[0].stocks).toEqual([
        { warehouse: "wh1", quantity: 10 },
        { warehouse: "wh2", quantity: 10 },
      ]);
    });

    it("handles stock quantity of 0", () => {
      // Arrange
      const attributes = createAttributes();
      const selections: SelectionState = {
        size: new Set(["s"]),
        color: new Set(["r"]),
      };
      const warehouses = [{ id: "wh1" }];
      const defaults = createDefaults({
        stockEnabled: true,
        stockQuantity: "0",
      });

      // Act
      const result = toBulkCreateInputs(attributes, selections, defaults, warehouses, []);

      // Assert
      expect(result[0].stocks).toEqual([{ warehouse: "wh1", quantity: 0 }]);
    });

    it("ignores negative stock quantity", () => {
      // Arrange
      const attributes = createAttributes();
      const selections: SelectionState = {
        size: new Set(["s"]),
        color: new Set(["r"]),
      };
      const warehouses = [{ id: "wh1" }];
      const defaults = createDefaults({
        stockEnabled: true,
        stockQuantity: "-5",
      });

      // Act
      const result = toBulkCreateInputs(attributes, selections, defaults, warehouses, []);

      // Assert
      expect(result[0].stocks).toBeUndefined();
    });

    it("does not include stock when stockEnabled is false", () => {
      // Arrange
      const attributes = createAttributes();
      const selections: SelectionState = {
        size: new Set(["s"]),
        color: new Set(["r"]),
      };
      const warehouses = [{ id: "wh1" }];
      const defaults = createDefaults({
        stockEnabled: false,
        stockQuantity: "10", // Even with quantity, should be ignored
      });

      // Act
      const result = toBulkCreateInputs(attributes, selections, defaults, warehouses, []);

      // Assert
      expect(result[0].stocks).toBeUndefined();
    });

    it("generates SKU when skuEnabled and prefix provided", () => {
      // Arrange
      const attributes = createAttributes();
      const selections: SelectionState = {
        size: new Set(["s"]),
        color: new Set(["r"]),
      };
      const defaults = createDefaults({
        skuEnabled: true,
        skuPrefix: "SHIRT",
      });

      // Act
      const result = toBulkCreateInputs(attributes, selections, defaults, [], []);

      // Assert
      expect(result[0].sku).toBe("SHIRT-small-red");
    });

    it("does not generate SKU when skuEnabled is false", () => {
      // Arrange
      const attributes = createAttributes();
      const selections: SelectionState = {
        size: new Set(["s"]),
        color: new Set(["r"]),
      };
      const defaults = createDefaults({
        skuEnabled: false,
        skuPrefix: "SHIRT",
      });

      // Act
      const result = toBulkCreateInputs(attributes, selections, defaults, [], []);

      // Assert
      expect(result[0].sku).toBeUndefined();
    });

    it("does not generate SKU when prefix is empty", () => {
      // Arrange
      const attributes = createAttributes();
      const selections: SelectionState = {
        size: new Set(["s"]),
        color: new Set(["r"]),
      };
      const defaults = createDefaults({
        skuEnabled: true,
        skuPrefix: "  ", // Whitespace only
      });

      // Act
      const result = toBulkCreateInputs(attributes, selections, defaults, [], []);

      // Assert
      expect(result[0].sku).toBeUndefined();
    });

    it("creates correct attribute structure", () => {
      // Arrange
      const attributes = createAttributes();
      const selections: SelectionState = {
        size: new Set(["s"]),
        color: new Set(["r"]),
      };

      // Act
      const result = toBulkCreateInputs(attributes, selections, createDefaults(), [], []);

      // Assert
      expect(result[0].attributes).toEqual([
        { id: "size", values: ["small"] },
        { id: "color", values: ["red"] },
      ]);
    });
  });
});
