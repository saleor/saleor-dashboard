import { type AttributeInput } from "@dashboard/components/Attributes";
import { AttributeEntityTypeEnum, AttributeInputTypeEnum } from "@dashboard/graphql";

import {
  filterPagesByAttributeValues,
  filterProductsByAttributeValues,
  type PagesToFilter,
  type ProductsToFilter,
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
  collections: [],
});

const createMockVariant = (
  id: string,
  name: string,
  product: NonNullable<ProductsToFilter>[number],
) => ({
  __typename: "ProductVariant" as const,
  id,
  name,
  sku: null,
  product: {
    __typename: "Product" as const,
    id: product.id,
    name: product.name,
    thumbnail: product.thumbnail,
    productType: product.productType,
  },
  channelListings: [],
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

    it("should keep selected variants visible for REFERENCE PRODUCT_VARIANT (dialog disables them)", () => {
      // Arrange
      const product1 = createMockProduct("prod-1", "Product 1");
      const product2 = createMockProduct("prod-2", "Product 2");
      const productsWithVariants = [
        {
          ...product1,
          productVariants: {
            __typename: "ProductVariantCountableConnection" as const,
            totalCount: 2,
            pageInfo: {
              __typename: "PageInfo" as const,
              hasNextPage: false,
              endCursor: null,
            },
            edges: [
              {
                __typename: "ProductVariantCountableEdge" as const,
                node: createMockVariant("var-1", "Variant 1", product1),
              },
              {
                __typename: "ProductVariantCountableEdge" as const,
                node: createMockVariant("var-2", "Variant 2", product1),
              },
            ],
          },
        },
        {
          ...product2,
          productVariants: {
            __typename: "ProductVariantCountableConnection" as const,
            totalCount: 2,
            pageInfo: {
              __typename: "PageInfo" as const,
              hasNextPage: false,
              endCursor: null,
            },
            edges: [
              {
                __typename: "ProductVariantCountableEdge" as const,
                node: createMockVariant("var-3", "Variant 3", product2),
              },
              {
                __typename: "ProductVariantCountableEdge" as const,
                node: createMockVariant("var-4", "Variant 4", product2),
              },
            ],
          },
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

      // Assert — list stays intact; selectedIds on the dialog locks already-assigned rows
      expect(result).toEqual(productsWithVariants);
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
