import { AttributeInputTypeEnum, VariantAttributeFragment } from "@dashboard/graphql";

import {
  AttributeData,
  ExistingVariantData,
  GeneratorDefaults,
  NonSelectionAttributeValues,
  SelectionState,
} from "./types";
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
      expect(result.combinations).toEqual([[]]);
      expect(result.totalCount).toBe(1);
      expect(result.isTruncated).toBe(false);
    });

    it("returns single array items wrapped in arrays", () => {
      // Arrange
      const input = [["a", "b"]];

      // Act
      const result = cartesianProduct(input);

      // Assert
      expect(result.combinations).toEqual([["a"], ["b"]]);
      expect(result.totalCount).toBe(2);
      expect(result.isTruncated).toBe(false);
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
      expect(result.combinations).toEqual([
        ["S", "Red"],
        ["S", "Blue"],
        ["M", "Red"],
        ["M", "Blue"],
      ]);
      expect(result.totalCount).toBe(4);
      expect(result.isTruncated).toBe(false);
    });

    it("computes cartesian product of three arrays", () => {
      // Arrange
      const input = [["S", "M"], ["Red"], ["Cotton", "Polyester"]];

      // Act
      const result = cartesianProduct(input);

      // Assert
      expect(result.combinations).toEqual([
        ["S", "Red", "Cotton"],
        ["S", "Red", "Polyester"],
        ["M", "Red", "Cotton"],
        ["M", "Red", "Polyester"],
      ]);
      expect(result.totalCount).toBe(4);
      expect(result.isTruncated).toBe(false);
    });

    it("truncates result and reports total when combinations exceed safety limit", () => {
      // Arrange - 5 arrays × 20 items = 3.2 million theoretical combinations
      const input = Array.from({ length: 5 }, (_, i) =>
        Array.from({ length: 20 }, (_, j) => `${i}-${j}`),
      );

      // Act
      const result = cartesianProduct(input);

      // Assert - should be capped at 1000 (MAX_COMBINATIONS) but report true total
      expect(result.combinations.length).toBeLessThanOrEqual(1000);
      expect(result.totalCount).toBe(3_200_000);
      expect(result.isTruncated).toBe(true);
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

    it("returns empty previews when no values selected", () => {
      // Arrange
      const attributes = createAttributes();
      const selections: SelectionState = {
        size: new Set(),
        color: new Set(),
      };

      // Act
      const result = generateVariantPreviews(attributes, selections, []);

      // Assert
      expect(result.previews).toEqual([]);
      expect(result.totalCount).toBe(0);
      expect(result.isTruncated).toBe(false);
    });

    it("returns empty previews when only some attributes have selections", () => {
      // Arrange
      const attributes = createAttributes();
      const selections: SelectionState = {
        size: new Set(["s"]),
        color: new Set(), // No color selected
      };

      // Act
      const result = generateVariantPreviews(attributes, selections, []);

      // Assert
      expect(result.previews).toEqual([]);
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
      expect(result.previews).toHaveLength(2);
      expect(result.totalCount).toBe(2);
      expect(result.isTruncated).toBe(false);
      expect(result.previews).toEqual([
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

      // Assert - new variants are sorted first
      expect(result.previews[0].isExisting).toBe(false); // Medium / Red is new (sorted first)
      expect(result.previews[1].isExisting).toBe(true); // Small / Red exists (sorted last)
    });

    it("does not mark as existing when existing combination has different attribute count", () => {
      // Arrange - existing variant has 3 attributes, we're generating with 2
      const attributes = createAttributes();
      const selections: SelectionState = {
        size: new Set(["s"]),
        color: new Set(["r"]),
      };
      const existingCombinations = [
        [
          { attributeId: "size", valueSlug: "small" },
          { attributeId: "color", valueSlug: "red" },
          { attributeId: "material", valueSlug: "cotton" }, // Extra attribute
        ],
      ];

      // Act
      const result = generateVariantPreviews(attributes, selections, existingCombinations);

      // Assert - should NOT match due to different attribute count
      expect(result.previews).toHaveLength(1);
      expect(result.previews[0].isExisting).toBe(false);
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

    it("does not skip combinations when existing has different attribute count", () => {
      // Arrange - existing variant has 3 attributes, we're generating with 2
      const attributes = createAttributes();
      const selections: SelectionState = {
        size: new Set(["s"]),
        color: new Set(["r"]),
      };
      const existingCombinations = [
        [
          { attributeId: "size", valueSlug: "small" },
          { attributeId: "color", valueSlug: "red" },
          { attributeId: "material", valueSlug: "cotton" }, // Extra attribute
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

      // Assert - should create the variant because attribute count differs
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Small / Red");
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

    it("slugifies attribute names when slug is missing", () => {
      // Arrange
      const attributes: AttributeData[] = [
        {
          id: "size",
          name: "Size",
          slug: "size",
          inputType: AttributeInputTypeEnum.DROPDOWN,
          values: [
            { id: "s", name: "Extra Large", slug: null }, // No slug, has spaces
          ],
        },
        {
          id: "color",
          name: "Color",
          slug: "color",
          inputType: AttributeInputTypeEnum.DROPDOWN,
          values: [
            { id: "r", name: "Bright Red", slug: null }, // No slug, has spaces
          ],
        },
      ];
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

      // Assert - names should be slugified (lowercase, hyphens)
      expect(result[0].sku).toBe("SHIRT-extra-large-bright-red");
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

    describe("non-selection attributes (required attributes)", () => {
      const createNonSelectionAttributes = (): VariantAttributeFragment[] =>
        [
          {
            id: "material",
            name: "Material",
            slug: "material",
            inputType: AttributeInputTypeEnum.DROPDOWN,
            valueRequired: true,
            choices: { edges: [], pageInfo: { hasNextPage: false, endCursor: null } },
          },
          {
            id: "weight",
            name: "Weight",
            slug: "weight",
            inputType: AttributeInputTypeEnum.NUMERIC,
            valueRequired: true,
            choices: null,
          },
          {
            id: "is-organic",
            name: "Is Organic",
            slug: "is-organic",
            inputType: AttributeInputTypeEnum.BOOLEAN,
            valueRequired: true,
            choices: null,
          },
          {
            id: "description",
            name: "Description",
            slug: "description",
            inputType: AttributeInputTypeEnum.PLAIN_TEXT,
            valueRequired: true,
            choices: null,
          },
          {
            id: "manufacture-date",
            name: "Manufacture Date",
            slug: "manufacture-date",
            inputType: AttributeInputTypeEnum.DATE,
            valueRequired: true,
            choices: null,
          },
          {
            id: "timestamp",
            name: "Timestamp",
            slug: "timestamp",
            inputType: AttributeInputTypeEnum.DATE_TIME,
            valueRequired: true,
            choices: null,
          },
        ] as VariantAttributeFragment[];

      it("includes non-selection attributes with DROPDOWN type using dropdown field", () => {
        // Arrange
        const attributes = createAttributes();
        const selections: SelectionState = {
          size: new Set(["s"]),
          color: new Set(["r"]),
        };
        const nonSelectionValues: NonSelectionAttributeValues = {
          material: ["cotton"],
        };
        const nonSelectionAttrs = createNonSelectionAttributes().filter(a => a.id === "material");

        // Act
        const result = toBulkCreateInputs(
          attributes,
          selections,
          createDefaults(),
          [],
          [],
          nonSelectionValues,
          nonSelectionAttrs,
        );

        // Assert
        expect(result[0].attributes).toContainEqual({
          id: "material",
          dropdown: { value: "cotton" },
        });
      });

      it("includes non-selection attributes with NUMERIC type using numeric field", () => {
        // Arrange
        const attributes = createAttributes();
        const selections: SelectionState = {
          size: new Set(["s"]),
          color: new Set(["r"]),
        };
        const nonSelectionValues: NonSelectionAttributeValues = {
          weight: ["150"],
        };
        const nonSelectionAttrs = createNonSelectionAttributes().filter(a => a.id === "weight");

        // Act
        const result = toBulkCreateInputs(
          attributes,
          selections,
          createDefaults(),
          [],
          [],
          nonSelectionValues,
          nonSelectionAttrs,
        );

        // Assert
        expect(result[0].attributes).toContainEqual({
          id: "weight",
          numeric: "150",
        });
      });

      it("includes non-selection attributes with BOOLEAN type using boolean field", () => {
        // Arrange
        const attributes = createAttributes();
        const selections: SelectionState = {
          size: new Set(["s"]),
          color: new Set(["r"]),
        };
        const nonSelectionValues: NonSelectionAttributeValues = {
          "is-organic": ["true"],
        };
        const nonSelectionAttrs = createNonSelectionAttributes().filter(a => a.id === "is-organic");

        // Act
        const result = toBulkCreateInputs(
          attributes,
          selections,
          createDefaults(),
          [],
          [],
          nonSelectionValues,
          nonSelectionAttrs,
        );

        // Assert
        expect(result[0].attributes).toContainEqual({
          id: "is-organic",
          boolean: true,
        });
      });

      it("handles BOOLEAN false value correctly", () => {
        // Arrange
        const attributes = createAttributes();
        const selections: SelectionState = {
          size: new Set(["s"]),
          color: new Set(["r"]),
        };
        const nonSelectionValues: NonSelectionAttributeValues = {
          "is-organic": ["false"],
        };
        const nonSelectionAttrs = createNonSelectionAttributes().filter(a => a.id === "is-organic");

        // Act
        const result = toBulkCreateInputs(
          attributes,
          selections,
          createDefaults(),
          [],
          [],
          nonSelectionValues,
          nonSelectionAttrs,
        );

        // Assert
        expect(result[0].attributes).toContainEqual({
          id: "is-organic",
          boolean: false,
        });
      });

      it("includes non-selection attributes with PLAIN_TEXT type using plainText field", () => {
        // Arrange
        const attributes = createAttributes();
        const selections: SelectionState = {
          size: new Set(["s"]),
          color: new Set(["r"]),
        };
        const nonSelectionValues: NonSelectionAttributeValues = {
          description: ["Premium quality cotton"],
        };
        const nonSelectionAttrs = createNonSelectionAttributes().filter(
          a => a.id === "description",
        );

        // Act
        const result = toBulkCreateInputs(
          attributes,
          selections,
          createDefaults(),
          [],
          [],
          nonSelectionValues,
          nonSelectionAttrs,
        );

        // Assert
        expect(result[0].attributes).toContainEqual({
          id: "description",
          plainText: "Premium quality cotton",
        });
      });

      it("includes non-selection attributes with DATE type using date field", () => {
        // Arrange
        const attributes = createAttributes();
        const selections: SelectionState = {
          size: new Set(["s"]),
          color: new Set(["r"]),
        };
        const nonSelectionValues: NonSelectionAttributeValues = {
          "manufacture-date": ["2024-01-15"],
        };
        const nonSelectionAttrs = createNonSelectionAttributes().filter(
          a => a.id === "manufacture-date",
        );

        // Act
        const result = toBulkCreateInputs(
          attributes,
          selections,
          createDefaults(),
          [],
          [],
          nonSelectionValues,
          nonSelectionAttrs,
        );

        // Assert
        expect(result[0].attributes).toContainEqual({
          id: "manufacture-date",
          date: "2024-01-15",
        });
      });

      it("includes non-selection attributes with DATE_TIME type using dateTime field", () => {
        // Arrange
        const attributes = createAttributes();
        const selections: SelectionState = {
          size: new Set(["s"]),
          color: new Set(["r"]),
        };
        const nonSelectionValues: NonSelectionAttributeValues = {
          timestamp: ["2024-01-15T10:30:00"],
        };
        const nonSelectionAttrs = createNonSelectionAttributes().filter(a => a.id === "timestamp");

        // Act
        const result = toBulkCreateInputs(
          attributes,
          selections,
          createDefaults(),
          [],
          [],
          nonSelectionValues,
          nonSelectionAttrs,
        );

        // Assert
        expect(result[0].attributes).toContainEqual({
          id: "timestamp",
          dateTime: "2024-01-15T10:30:00",
        });
      });

      it("combines selection and non-selection attributes in output", () => {
        // Arrange
        const attributes = createAttributes();
        const selections: SelectionState = {
          size: new Set(["s"]),
          color: new Set(["r"]),
        };
        const nonSelectionValues: NonSelectionAttributeValues = {
          weight: ["150"],
          "is-organic": ["true"],
        };
        const nonSelectionAttrs = createNonSelectionAttributes().filter(
          a => a.id === "weight" || a.id === "is-organic",
        );

        // Act
        const result = toBulkCreateInputs(
          attributes,
          selections,
          createDefaults(),
          [],
          [],
          nonSelectionValues,
          nonSelectionAttrs,
        );

        // Assert - should have 2 selection attrs + 2 non-selection attrs
        expect(result[0].attributes).toHaveLength(4);
        expect(result[0].attributes).toContainEqual({ id: "size", values: ["small"] });
        expect(result[0].attributes).toContainEqual({ id: "color", values: ["red"] });
        expect(result[0].attributes).toContainEqual({ id: "weight", numeric: "150" });
        expect(result[0].attributes).toContainEqual({ id: "is-organic", boolean: true });
      });

      it("ignores non-selection attributes with empty values", () => {
        // Arrange
        const attributes = createAttributes();
        const selections: SelectionState = {
          size: new Set(["s"]),
          color: new Set(["r"]),
        };
        const nonSelectionValues: NonSelectionAttributeValues = {
          weight: [], // Empty - should be ignored
          "is-organic": ["true"],
        };
        const nonSelectionAttrs = createNonSelectionAttributes().filter(
          a => a.id === "weight" || a.id === "is-organic",
        );

        // Act
        const result = toBulkCreateInputs(
          attributes,
          selections,
          createDefaults(),
          [],
          [],
          nonSelectionValues,
          nonSelectionAttrs,
        );

        // Assert - only 2 selection attrs + 1 non-selection attr (weight is ignored)
        expect(result[0].attributes).toHaveLength(3);
        expect(result[0].attributes).not.toContainEqual(expect.objectContaining({ id: "weight" }));
      });
    });
  });
});
