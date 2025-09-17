import { AttributeInput } from "@dashboard/components/Attributes";
import { AttributeEntityTypeEnum, AttributeInputTypeEnum } from "@dashboard/graphql";

import {
  filterPagesByAttributeValues,
  filterProductsByAttributeValues,
  PagesToFilter,
  ProductsToFilter,
} from "./utils";

const createMockProduct = (id: string, name: string): NonNullable<ProductsToFilter>[number] => ({
  __typename: "Product",
  id,
  name,
  productType: {
    __typename: "ProductType",
    id: "type-1",
    name: "Product Type",
  },
  thumbnail: {
    __typename: "Image",
    url: "https://example.com/image.jpg",
  },
  channelListings: [],
  variants: [],
  collections: [],
});

const createMockPage = (id: string, title: string): NonNullable<PagesToFilter>[number] => ({
  __typename: "Page",
  id,
  title,
});

describe("AssignAttributeValueDialog/utils", () => {
  describe("filterProductsByAttributeValues", () => {
    const mockProducts = [
      createMockProduct("prod-1", "Product 1"),
      createMockProduct("prod-2", "Product 2"),
      createMockProduct("prod-3", "Product 3"),
    ];

    it("should not filter products list for SINGLE_REFERENCE type - in order to show current selection", () => {
      // Arrange
      const attribute: AttributeInput = {
        id: "attr-1",
        label: "Test Attribute",
        value: ["prod-1"],
        data: {
          inputType: AttributeInputTypeEnum.SINGLE_REFERENCE,
          entityType: AttributeEntityTypeEnum.PRODUCT,
          isRequired: false,
          values: [],
        },
      };

      // Act
      const result = filterProductsByAttributeValues(mockProducts, attribute);

      // Assert
      expect(result).toEqual(mockProducts);
      expect(result).toHaveLength(3);
    });

    it("should filter out selected products for REFERENCE type - in order to add only new items", () => {
      // Arrange
      const attribute: AttributeInput = {
        id: "attr-1",
        label: "Test Attribute",
        value: ["prod-1", "prod-3"],
        data: {
          inputType: AttributeInputTypeEnum.REFERENCE,
          entityType: AttributeEntityTypeEnum.PRODUCT,
          isRequired: false,
          values: [],
        },
      };

      // Act
      const result = filterProductsByAttributeValues(mockProducts, attribute);

      // Assert
      expect(result).toEqual([createMockProduct("prod-2", "Product 2")]);
      expect(result).toHaveLength(1);
    });

    it("should handle empty value array for REFERENCE type", () => {
      // Arrange
      const attribute: AttributeInput = {
        id: "attr-1",
        label: "Test Attribute",
        value: [],
        data: {
          inputType: AttributeInputTypeEnum.REFERENCE,
          entityType: AttributeEntityTypeEnum.PRODUCT,
          isRequired: false,
          values: [],
        },
      };

      // Act
      const result = filterProductsByAttributeValues(mockProducts, attribute);

      // Assert
      expect(result).toEqual(mockProducts);
      expect(result).toHaveLength(3);
    });

    it("should filter out selected variants in REFERENCE attribute with PRODUCT_VARIANT entity type", () => {
      // Arrange
      const productsWithVariants = [
        {
          ...createMockProduct("prod-1", "Product 1"),
          variants: [
            // This variant is already selected
            {
              __typename: "ProductVariant" as const,
              id: "var-1",
              name: "Variant 1",
              sku: null,
              product: createMockProduct("prod-1", "Product 1"),
              channelListings: [],
            },
            // This variant is not selected
            {
              __typename: "ProductVariant" as const,
              id: "var-2",
              name: "Variant 2",
              sku: null,
              product: createMockProduct("prod-1", "Product 1"),
              channelListings: [],
            },
          ],
        },
        {
          ...createMockProduct("prod-2", "Product 2"),
          variants: [
            // This variant is already selected
            {
              __typename: "ProductVariant" as const,
              id: "var-3",
              name: "Variant 3",
              sku: null,
              product: createMockProduct("prod-2", "Product 2"),
              channelListings: [],
            },
            // This variant is not selected
            {
              __typename: "ProductVariant" as const,
              id: "var-4",
              name: "Variant 4",
              sku: null,
              product: createMockProduct("prod-2", "Product 2"),
              channelListings: [],
            },
          ],
        },
      ];

      const attribute: AttributeInput = {
        id: "attr-1",
        label: "Test Attribute",
        value: ["var-1", "var-3"],
        data: {
          inputType: AttributeInputTypeEnum.REFERENCE,
          entityType: AttributeEntityTypeEnum.PRODUCT_VARIANT,
          isRequired: false,
          values: [],
        },
      };

      // Act
      const result = filterProductsByAttributeValues(productsWithVariants, attribute);

      // Assert
      expect(result).toHaveLength(2);
      expect(result?.[0].variants).toEqual([
        {
          __typename: "ProductVariant",
          id: "var-2",
          name: "Variant 2",
          sku: null,
          product: createMockProduct("prod-1", "Product 1"),
          channelListings: [],
        },
      ]);
      expect(result?.[1].variants).toEqual([
        {
          __typename: "ProductVariant",
          id: "var-4",
          name: "Variant 4",
          sku: null,
          product: createMockProduct("prod-2", "Product 2"),
          channelListings: [],
        },
      ]);
    });
  });

  describe("filterPagesByAttributeValues", () => {
    const mockPages = [
      createMockPage("page-1", "Page 1"),
      createMockPage("page-2", "Page 2"),
      createMockPage("page-3", "Page 3"),
    ];

    it("should not filter selected pages for SINGLE_REFERENCE attributes - in order to show current selection", () => {
      // Arrange
      const attribute: AttributeInput = {
        id: "attr-1",
        label: "Test Attribute",
        value: ["page-1"],
        data: {
          inputType: AttributeInputTypeEnum.SINGLE_REFERENCE,
          isRequired: false,
          values: [],
        },
      };

      // Act
      const result = filterPagesByAttributeValues(mockPages, attribute);

      // Assert
      expect(result).toEqual(mockPages);
      expect(result).toHaveLength(3);
    });

    it("should filter out selected pages for REFERENCE attribute - in order to add only new items", () => {
      // Arrange
      const attribute: AttributeInput = {
        id: "attr-1",
        label: "Test Attribute",
        value: ["page-2"],
        data: {
          inputType: AttributeInputTypeEnum.REFERENCE,
          isRequired: false,
          values: [],
        },
      };

      // Act
      const result = filterPagesByAttributeValues(mockPages, attribute);

      // Assert
      expect(result).toEqual([
        createMockPage("page-1", "Page 1"),
        createMockPage("page-3", "Page 3"),
      ]);
      expect(result).toHaveLength(2);
    });

    it("should handle null/undefined pages array", () => {
      // Arrange
      const attribute: AttributeInput = {
        id: "attr-1",
        label: "Test Attribute",
        value: ["page-1"],
        data: {
          inputType: AttributeInputTypeEnum.REFERENCE,
          isRequired: false,
          values: [],
        },
      };

      // Act
      const resultNull = filterPagesByAttributeValues(null, attribute);
      const resultUndefined = filterPagesByAttributeValues(undefined as any, attribute);

      // Assert
      expect(resultNull).toEqual([]);
      expect(resultUndefined).toEqual([]);
    });
  });
});
