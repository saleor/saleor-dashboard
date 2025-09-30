import {
  AttributeEntityTypeEnum,
  AttributeInputTypeEnum,
  SelectedVariantAttributeFragment,
} from "@dashboard/graphql";
import { Container } from "@dashboard/types";

import {
  getReferenceAttributeDisplayData,
  getSelectedAttributeValues,
  handleContainerReferenceAssignment,
  handleMetadataReferenceAssignment,
  ReferenceEntitiesSearch,
} from "./data";

// Helper function to create mock reference data with minimal required properties
const createMockReferenceData = (data: {
  products?: Array<{
    id: string;
    name: string;
    variants?: Array<{ id: string; name: string }> | undefined;
  }>;
  pages?: Array<{ id: string; title: string }>;
  collections?: Array<{ id: string; name: string }>;
  categories?: Array<{ id: string; name: string }>;
}): ReferenceEntitiesSearch => {
  const result: ReferenceEntitiesSearch = {};

  if (data.products) {
    result.products = data.products.map(p => ({
      __typename: "Product" as const,
      id: p.id,
      name: p.name,
      productType: { __typename: "ProductType" as const, id: "type-1", name: "Type" },
      thumbnail: null,
      channelListings: null,
      variants: p.variants
        ? p.variants.map(v => ({
            __typename: "ProductVariant" as const,
            id: v.id,
            name: v.name,
            sku: null,
            product: {
              __typename: "Product" as const,
              id: p.id,
              name: p.name,
              thumbnail: null,
              productType: { __typename: "ProductType" as const, id: "type-1", name: "Type" },
            },
            channelListings: null,
          }))
        : null,
      collections: null,
    }));
  }

  if (data.pages) {
    result.pages = data.pages.map(p => ({
      __typename: "Page",
      id: p.id,
      title: p.title,
    }));
  }

  if (data.collections) {
    result.collections = data.collections.map(c => ({
      __typename: "Collection" as const,
      id: c.id,
      name: c.name,
    }));
  }

  if (data.categories) {
    result.categories = data.categories.map(c => ({
      __typename: "Category" as const,
      id: c.id,
      name: c.name,
      level: 0,
      parent: null,
      ancestors: null,
    }));
  }

  return result;
};

describe("attributes/utils/data", () => {
  describe("handleContainerReferenceAssignment", () => {
    const mockHandlers = {
      selectAttributeReference: jest.fn(),
      selectAttributeReferenceAdditionalData: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should replace value for SINGLE_REFERENCE attribute after selecting item in modal", () => {
      // Arrange
      const assignReferencesAttributeId = "attr-1";
      const attributeValues: Container[] = [
        { id: "val-1", name: "Value 1" },
        { id: "val-2", name: "Value 2" },
      ];
      const attributes = [
        {
          id: "attr-1",
          value: ["old-value"],
          label: "Test Attribute",
          data: {
            inputType: AttributeInputTypeEnum.SINGLE_REFERENCE,
            isRequired: false,
            values: [],
          },
        },
      ];

      // Act
      handleContainerReferenceAssignment(
        assignReferencesAttributeId,
        attributeValues,
        attributes,
        mockHandlers,
      );

      // Assert
      expect(mockHandlers.selectAttributeReference).toHaveBeenCalledWith("attr-1", ["val-1"]);
      expect(mockHandlers.selectAttributeReferenceAdditionalData).toHaveBeenCalledWith("attr-1", [
        { value: "val-1", label: "Value 1" },
      ]);
    });

    it("should append values for REFERENCE attribute after selecting item in modal", () => {
      // Arrange
      const assignReferencesAttributeId = "attr-1";
      const attributeValues: Container[] = [
        { id: "val-1", name: "Value 1" },
        { id: "val-2", name: "Value 2" },
      ];
      const attributes = [
        {
          id: "attr-1",
          value: ["existing-1", "existing-2"],
          label: "Test Attribute",
          data: {
            inputType: AttributeInputTypeEnum.REFERENCE,
            isRequired: false,
            values: [],
          },
        },
      ];

      // Act
      handleContainerReferenceAssignment(
        assignReferencesAttributeId,
        attributeValues,
        attributes,
        mockHandlers,
      );

      // Assert
      expect(mockHandlers.selectAttributeReference).toHaveBeenCalledWith("attr-1", [
        "existing-1",
        "existing-2",
        "val-1",
        "val-2",
      ]);
      expect(mockHandlers.selectAttributeReferenceAdditionalData).toHaveBeenCalledWith("attr-1", [
        { value: "val-1", label: "Value 1" },
        { value: "val-2", label: "Value 2" },
      ]);
    });

    it("should handle empty initial values", () => {
      // Arrange
      const assignReferencesAttributeId = "attr-1";
      const attributeValues: Container[] = [{ id: "val-1", name: "Value 1" }];
      const attributes = [
        {
          id: "attr-1",
          value: [],
          label: "Test Attribute",
          data: {
            inputType: AttributeInputTypeEnum.REFERENCE,
            isRequired: false,
            values: [],
          },
        },
      ];

      // Act
      handleContainerReferenceAssignment(
        assignReferencesAttributeId,
        attributeValues,
        attributes,
        mockHandlers,
      );

      // Assert
      expect(mockHandlers.selectAttributeReference).toHaveBeenCalledWith("attr-1", ["val-1"]);
      expect(mockHandlers.selectAttributeReferenceAdditionalData).toHaveBeenCalledWith("attr-1", [
        { value: "val-1", label: "Value 1" },
      ]);
    });
  });

  describe("handleMetadataReferenceAssignment", () => {
    const mockHandlers = {
      selectAttributeReference: jest.fn(),
      selectAttributeReferenceAdditionalData: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should replace value for SINGLE_REFERENCE attribute after selecting item in modal", () => {
      // Arrange
      const assignReferencesAttributeId = "attr-1";
      const attributeValues = [
        { value: "val-1", label: "Value 1" },
        { value: "val-2", label: "Value 2" },
      ];
      const attributes = [
        {
          id: "attr-1",
          value: ["old-value"],
          label: "Test Attribute",
          data: {
            inputType: AttributeInputTypeEnum.SINGLE_REFERENCE,
            isRequired: false,
            values: [],
          },
        },
      ];

      // Act
      handleMetadataReferenceAssignment(
        assignReferencesAttributeId,
        attributeValues,
        attributes,
        mockHandlers,
      );

      // Assert
      expect(mockHandlers.selectAttributeReference).toHaveBeenCalledWith("attr-1", ["val-1"]);
      expect(mockHandlers.selectAttributeReferenceAdditionalData).toHaveBeenCalledWith("attr-1", [
        { value: "val-1", label: "Value 1" },
      ]);
    });

    it("should append values for REFERENCE attribute after selecting item in modal", () => {
      // Arrange
      const assignReferencesAttributeId = "attr-1";
      const attributeValues = [
        { value: "val-1", label: "Value 1" },
        { value: "val-2", label: "Value 2" },
      ];
      const attributes = [
        {
          id: "attr-1",
          value: ["existing-1", "existing-2"],
          label: "Test Attribute",
          data: {
            inputType: AttributeInputTypeEnum.REFERENCE,
            isRequired: false,
            values: [],
          },
        },
      ];

      // Act
      handleMetadataReferenceAssignment(
        assignReferencesAttributeId,
        attributeValues,
        attributes,
        mockHandlers,
      );

      // Assert
      expect(mockHandlers.selectAttributeReference).toHaveBeenCalledWith("attr-1", [
        "existing-1",
        "existing-2",
        "val-1",
        "val-2",
      ]);
      expect(mockHandlers.selectAttributeReferenceAdditionalData).toHaveBeenCalledWith(
        "attr-1",
        attributeValues,
      );
    });

    it("should handle empty attribute values", () => {
      // Arrange
      const assignReferencesAttributeId = "attr-1";
      const attributeValues: Array<{ value: string; label: string }> = [];
      const attributes = [
        {
          id: "attr-1",
          value: ["existing-1"],
          label: "Test Attribute",
          data: {
            inputType: AttributeInputTypeEnum.REFERENCE,
            isRequired: false,
            values: [],
          },
        },
      ];

      // Act
      handleMetadataReferenceAssignment(
        assignReferencesAttributeId,
        attributeValues,
        attributes,
        mockHandlers,
      );

      // Assert
      expect(mockHandlers.selectAttributeReference).toHaveBeenCalledWith("attr-1", ["existing-1"]);
      expect(mockHandlers.selectAttributeReferenceAdditionalData).toHaveBeenCalledWith(
        "attr-1",
        [],
      );
    });
  });

  describe("getReferenceAttributeDisplayData", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should use display data from useFormset metadata when available", () => {
      // Arrange
      const attribute = {
        id: "attr-metadata-test",
        value: ["meta-ref-1", "meta-ref-2"],
        label: "Test",
        data: {
          inputType: AttributeInputTypeEnum.REFERENCE,
          entityType: AttributeEntityTypeEnum.PRODUCT,
          isRequired: false,
          values: [],
          references: [],
        },
        additionalData: [
          { value: "meta-ref-1", label: "Product 1" },
          { value: "meta-ref-2", label: "Product 2" },
        ],
      };
      const references = createMockReferenceData({
        products: [{ id: "meta-ref-3", name: "Product 3" }],
      });

      // Act
      const result = getReferenceAttributeDisplayData(attribute, references);

      // Assert
      expect(result.data.references).toEqual([
        { value: "meta-ref-1", label: "Product 1" },
        { value: "meta-ref-2", label: "Product 2" },
      ]);
    });

    it("should search for display data in attribute references when metadata not available", () => {
      // Arrange
      const attribute = {
        id: "attr-fallback-test",
        value: ["fallback-ref-1", "fallback-ref-2"],
        label: "Test",
        data: {
          inputType: AttributeInputTypeEnum.REFERENCE,
          entityType: AttributeEntityTypeEnum.PRODUCT,
          isRequired: false,
          values: [],
          references: [],
        },
      };
      const references = createMockReferenceData({
        products: [
          { id: "fallback-ref-1", name: "Product 1" },
          { id: "fallback-ref-2", name: "Product 2" },
        ],
      });

      // Act
      const result = getReferenceAttributeDisplayData(attribute, references);

      // Assert
      expect(result.data.references).toEqual([
        { value: "fallback-ref-1", label: "Product 1" },
        { value: "fallback-ref-2", label: "Product 2" },
      ]);
    });

    it("should handle page references", () => {
      // Arrange
      const attribute = {
        id: "attr-page-test",
        value: ["test-page-1"],
        label: "Test",
        data: {
          inputType: AttributeInputTypeEnum.REFERENCE,
          entityType: AttributeEntityTypeEnum.PAGE,
          isRequired: false,
          values: [],
          references: [],
        },
      };
      const references = createMockReferenceData({
        pages: [{ id: "test-page-1", title: "Page Title" }],
      });

      // Act
      const result = getReferenceAttributeDisplayData(attribute, references);

      // Assert
      expect(result.data.references).toEqual([{ value: "test-page-1", label: "Page Title" }]);
    });

    it("should handle product variant references", () => {
      // Arrange
      const attribute = {
        id: "attr-variant-test",
        value: ["test-variant-1"],
        label: "Test",
        data: {
          inputType: AttributeInputTypeEnum.REFERENCE,
          entityType: AttributeEntityTypeEnum.PRODUCT_VARIANT,
          isRequired: false,
          values: [],
          references: [],
        },
      };
      const references = createMockReferenceData({
        products: [
          {
            id: "test-product-1",
            name: "Product 1",
            variants: [
              { id: "test-variant-1", name: "Variant A" },
              { id: "test-variant-2", name: "Variant B" },
            ],
          },
        ],
      });

      // Act
      const result = getReferenceAttributeDisplayData(attribute, references);

      // Assert
      expect(result.data.references).toEqual([
        { value: "test-variant-1", label: "Product 1 Variant A" },
      ]);
    });

    it("should use ID as fallback when reference nor metadata is found", () => {
      // Arrange
      const attribute = {
        id: "attr-unknown-test",
        value: ["test-unknown-ref"],
        label: "Test",
        data: {
          inputType: AttributeInputTypeEnum.REFERENCE,
          entityType: AttributeEntityTypeEnum.PRODUCT,
          isRequired: false,
          values: [],
          references: [],
        },
      };
      const references = createMockReferenceData({
        products: [],
      });

      // Act
      const result = getReferenceAttributeDisplayData(attribute, references);

      // Assert
      expect(result.data.references).toEqual([
        { value: "test-unknown-ref", label: "test-unknown-ref" },
      ]);
    });

    it("should handle product variant reference search for products without variants gracefully", () => {
      // Arrange
      const products = [
        {
          id: "product-1",
          name: "Product 1",
          // No variants property
        },
        {
          id: "product-2",
          name: "Product 2",
          variants: [], // Empty variants
        },
        {
          id: "product-3",
          name: "Product 3",
          variants: [{ id: "v3", name: "Variant 3" }],
        },
      ];

      const attribute = {
        id: "attr-1",
        value: ["v3", "non-existent"],
        label: "Test",
        data: {
          inputType: AttributeInputTypeEnum.REFERENCE,
          entityType: AttributeEntityTypeEnum.PRODUCT_VARIANT,
          isRequired: false,
          values: [],
          references: [],
        },
      };

      // Act
      const result = getReferenceAttributeDisplayData(
        attribute,
        createMockReferenceData({ products }),
      );

      // Assert
      expect(result.data.references).toEqual([
        { value: "v3", label: "Product 3 Variant 3" },
        { value: "non-existent", label: "non-existent" }, // Fallback
      ]);
    });

    describe("product variant caching", () => {
      it("should use cache and not re-parse variants on multiple calls", () => {
        // Arrange
        let variantGetterCallCount = 0;
        const products = [
          {
            id: "cache-test-product",
            name: "Cache Test Product",
            get variants() {
              // Check how many times we access this
              variantGetterCallCount++;

              return [
                { id: "cache-variant-1", name: "Cache Variant 1" },
                { id: "cache-variant-2", name: "Cache Variant 2" },
                { id: "cache-variant-3", name: "Cache Variant 3" },
              ];
            },
          },
        ];

        const references = createMockReferenceData({ products });

        // Create multiple attributes requesting different variants from same product
        const attribute1 = {
          id: "attr-cache-1",
          value: ["cache-variant-1"],
          label: "Test 1",
          data: {
            inputType: AttributeInputTypeEnum.REFERENCE,
            entityType: AttributeEntityTypeEnum.PRODUCT_VARIANT,
            isRequired: false,
            values: [],
            references: [],
          },
        };

        const attribute2 = {
          id: "attr-cache-2",
          value: ["cache-variant-2"],
          label: "Test 2",
          data: {
            inputType: AttributeInputTypeEnum.REFERENCE,
            entityType: AttributeEntityTypeEnum.PRODUCT_VARIANT,
            isRequired: false,
            values: [],
            references: [],
          },
        };

        const attribute3 = {
          id: "attr-cache-3",
          value: ["cache-variant-3", "cache-variant-1"],
          label: "Test 3",
          data: {
            inputType: AttributeInputTypeEnum.REFERENCE,
            entityType: AttributeEntityTypeEnum.PRODUCT_VARIANT,
            isRequired: false,
            values: [],
            references: [],
          },
        };

        // Act - Call getReferenceAttributeDisplayData multiple times
        const result1 = getReferenceAttributeDisplayData(attribute1, references);
        const result2 = getReferenceAttributeDisplayData(attribute2, references);
        const result3 = getReferenceAttributeDisplayData(attribute3, references);

        // Assert - Verify cache is working
        expect(result1.data.references).toEqual([
          { value: "cache-variant-1", label: "Cache Test Product Cache Variant 1" },
        ]);
        expect(result2.data.references).toEqual([
          { value: "cache-variant-2", label: "Cache Test Product Cache Variant 2" },
        ]);
        expect(result3.data.references).toEqual([
          { value: "cache-variant-3", label: "Cache Test Product Cache Variant 3" },
          { value: "cache-variant-1", label: "Cache Test Product Cache Variant 1" },
        ]);

        // Variants getter should only be called TWICE
        // Once for truthy check, once for iteration to build the cache
        // All subsequent lookups should use cache
        expect(variantGetterCallCount).toBe(2);
      });

      it("should maintain separate caches for different products", () => {
        // Arrange
        let product1GetterCalls = 0;
        let product2GetterCalls = 0;

        const products = [
          {
            id: "separate-cache-product-1",
            name: "Separate Cache Product 1",
            get variants() {
              product1GetterCalls++;

              return [
                { id: "sep-p1-v1", name: "P1 Variant 1" },
                { id: "sep-p1-v2", name: "P1 Variant 2" },
              ];
            },
          },
          {
            id: "separate-cache-product-2",
            name: "Separate Cache Product 2",
            get variants() {
              product2GetterCalls++;

              return [
                { id: "sep-p2-v1", name: "P2 Variant 1" },
                { id: "sep-p2-v2", name: "P2 Variant 2" },
              ];
            },
          },
        ];

        const references = createMockReferenceData({ products });

        const attribute = {
          id: "attr-separate-cache",
          value: ["sep-p1-v1", "sep-p2-v1", "sep-p1-v2", "sep-p2-v2"],
          label: "Test",
          data: {
            inputType: AttributeInputTypeEnum.REFERENCE,
            entityType: AttributeEntityTypeEnum.PRODUCT_VARIANT,
            isRequired: false,
            values: [],
            references: [],
          },
        };

        // Act - Single call should build cache for both products
        const result = getReferenceAttributeDisplayData(attribute, references);

        // Assert
        expect(result.data.references).toEqual([
          { value: "sep-p1-v1", label: "Separate Cache Product 1 P1 Variant 1" },
          { value: "sep-p2-v1", label: "Separate Cache Product 2 P2 Variant 1" },
          { value: "sep-p1-v2", label: "Separate Cache Product 1 P1 Variant 2" },
          { value: "sep-p2-v2", label: "Separate Cache Product 2 P2 Variant 2" },
        ]);

        expect(product1GetterCalls).toBe(2); // truthy check + iteration for product 1
        expect(product2GetterCalls).toBe(2); // truthy check + iteration for product 2
      });
    });
  });

  describe("getSelectedAttributeValues", () => {
    // Helper to create minimal test attributes that satisfy the type requirements
    const createTestAttribute = (inputType: AttributeInputTypeEnum, values: any[]) => {
      return {
        attribute: { inputType },
        values,
      } as unknown as SelectedVariantAttributeFragment;
    };

    it("should return empty array for REFERENCE attribute with empty values", () => {
      // Arrange
      const attribute = createTestAttribute(AttributeInputTypeEnum.REFERENCE, []);

      // Act
      const result = getSelectedAttributeValues(attribute);

      // Assert
      expect(result).toEqual([]);
    });

    it("should return reference IDs for REFERENCE attribute with values", () => {
      // Arrange
      const attribute = createTestAttribute(AttributeInputTypeEnum.REFERENCE, [
        { reference: "ref-1" },
        { reference: "ref-2" },
      ]);

      // Act
      const result = getSelectedAttributeValues(attribute);

      // Assert
      expect(result).toEqual(["ref-1", "ref-2"]);
    });

    it("should return empty array for SINGLE_REFERENCE attribute with empty values", () => {
      // Arrange
      const attribute = createTestAttribute(AttributeInputTypeEnum.SINGLE_REFERENCE, []);

      // Act
      const result = getSelectedAttributeValues(attribute);

      // Assert
      expect(result).toEqual([]);
    });

    it("should return array with reference ID for SINGLE_REFERENCE attribute with value", () => {
      // Arrange
      const attribute = createTestAttribute(AttributeInputTypeEnum.SINGLE_REFERENCE, [
        { reference: "ref-1" },
      ]);

      // Act
      const result = getSelectedAttributeValues(attribute);

      // Assert
      expect(result).toEqual(["ref-1"]);
    });

    it("should return empty array for PLAIN_TEXT attribute with empty values", () => {
      // Arrange
      const attribute = createTestAttribute(AttributeInputTypeEnum.PLAIN_TEXT, []);

      // Act
      const result = getSelectedAttributeValues(attribute);

      // Assert
      expect(result).toEqual([]);
    });

    it("should return array with text for PLAIN_TEXT attribute with value", () => {
      // Arrange
      const attribute = createTestAttribute(AttributeInputTypeEnum.PLAIN_TEXT, [
        { plainText: "Some text" },
      ]);

      // Act
      const result = getSelectedAttributeValues(attribute);

      // Assert
      expect(result).toEqual(["Some text"]);
    });

    it("should return empty array for RICH_TEXT attribute with empty values", () => {
      // Arrange
      const attribute = createTestAttribute(AttributeInputTypeEnum.RICH_TEXT, []);

      // Act
      const result = getSelectedAttributeValues(attribute);

      // Assert
      expect(result).toEqual([]);
    });

    it("should return array with rich text for RICH_TEXT attribute with value", () => {
      // Arrange
      const attribute = createTestAttribute(AttributeInputTypeEnum.RICH_TEXT, [
        { richText: "<p>Rich text</p>" },
      ]);

      // Act
      const result = getSelectedAttributeValues(attribute);

      // Assert
      expect(result).toEqual(["<p>Rich text</p>"]);
    });

    it("should return empty array for NUMERIC attribute with empty values", () => {
      // Arrange
      const attribute = createTestAttribute(AttributeInputTypeEnum.NUMERIC, []);

      // Act
      const result = getSelectedAttributeValues(attribute);

      // Assert
      expect(result).toEqual([]);
    });

    it("should return array with name for NUMERIC attribute with value", () => {
      // Arrange
      const attribute = createTestAttribute(AttributeInputTypeEnum.NUMERIC, [{ name: "123" }]);

      // Act
      const result = getSelectedAttributeValues(attribute);

      // Assert
      expect(result).toEqual(["123"]);
    });

    it("should return empty array for BOOLEAN attribute with empty values", () => {
      // Arrange
      const attribute = createTestAttribute(AttributeInputTypeEnum.BOOLEAN, []);

      // Act
      const result = getSelectedAttributeValues(attribute);

      // Assert
      expect(result).toEqual([]);
    });

    it("should return array with false for BOOLEAN attribute with false value", () => {
      // Arrange
      const attribute = createTestAttribute(AttributeInputTypeEnum.BOOLEAN, [{ boolean: false }]);

      // Act
      const result = getSelectedAttributeValues(attribute);

      // Assert
      expect(result).toEqual([false]);
    });

    it("should return array with true for BOOLEAN attribute with true value", () => {
      // Arrange
      const attribute = createTestAttribute(AttributeInputTypeEnum.BOOLEAN, [{ boolean: true }]);

      // Act
      const result = getSelectedAttributeValues(attribute);

      // Assert
      expect(result).toEqual([true]);
    });

    it("should return empty array for DATE attribute with empty values", () => {
      // Arrange
      const attribute = createTestAttribute(AttributeInputTypeEnum.DATE, []);

      // Act
      const result = getSelectedAttributeValues(attribute);

      // Assert
      expect(result).toEqual([]);
    });

    it("should return array with date for DATE attribute with value", () => {
      // Arrange
      const attribute = createTestAttribute(AttributeInputTypeEnum.DATE, [{ date: "2024-01-15" }]);

      // Act
      const result = getSelectedAttributeValues(attribute);

      // Assert
      expect(result).toEqual(["2024-01-15"]);
    });

    it("should return empty array for DATE_TIME attribute with empty values", () => {
      // Arrange
      const attribute = createTestAttribute(AttributeInputTypeEnum.DATE_TIME, []);

      // Act
      const result = getSelectedAttributeValues(attribute);

      // Assert
      expect(result).toEqual([]);
    });

    it("should return array with datetime for DATE_TIME attribute with value", () => {
      // Arrange
      const attribute = createTestAttribute(AttributeInputTypeEnum.DATE_TIME, [
        { dateTime: "2024-01-15T10:30:00Z" },
      ]);

      // Act
      const result = getSelectedAttributeValues(attribute);

      // Assert
      expect(result).toEqual(["2024-01-15T10:30:00Z"]);
    });

    it("should return slugs for default attribute type (DROPDOWN/MULTISELECT) with values", () => {
      // Arrange
      const attribute = createTestAttribute(AttributeInputTypeEnum.DROPDOWN, [
        { slug: "option-1" },
        { slug: "option-2" },
      ]);

      // Act
      const result = getSelectedAttributeValues(attribute);

      // Assert
      expect(result).toEqual(["option-1", "option-2"]);
    });

    it("should return empty array for default attribute type with empty values", () => {
      // Arrange
      const attribute = createTestAttribute(AttributeInputTypeEnum.MULTISELECT, []);

      // Act
      const result = getSelectedAttributeValues(attribute);

      // Assert
      expect(result).toEqual([]);
    });

    it("should handle null/undefined fields gracefully", () => {
      // Arrange
      const attributeWithNullReference = createTestAttribute(
        AttributeInputTypeEnum.SINGLE_REFERENCE,
        [{ reference: null }],
      );
      const attributeWithUndefinedPlainText = createTestAttribute(
        AttributeInputTypeEnum.PLAIN_TEXT,
        [{ plainText: undefined }],
      );

      // Act
      const result1 = getSelectedAttributeValues(attributeWithNullReference);
      const result2 = getSelectedAttributeValues(attributeWithUndefinedPlainText);

      // Assert
      expect(result1).toEqual([]);
      expect(result2).toEqual([]);
    });
  });
});
