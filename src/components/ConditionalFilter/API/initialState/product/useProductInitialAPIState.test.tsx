import { AttributeEntityTypeEnum } from "@dashboard/graphql";
import { act, renderHook } from "@testing-library/react-hooks";

import { useProductInitialAPIState } from "./useProductInitialAPIState";

const mockQuery = jest.fn();
const mockClient = { query: mockQuery };

jest.mock("@apollo/client", () => ({
  ...(jest.requireActual("@apollo/client") as jest.Mocked<typeof import("@apollo/client")>),
  useApolloClient: jest.fn(() => mockClient),
}));

describe("useProductInitialAPIState - Reference Attributes Logic", () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  // TODO: We should test more cases here for fetching initial data

  describe("PAGE reference attribute", () => {
    it("should fetch attribute definition first, then fetch page choices based on entity type", async () => {
      // Arrange
      mockQuery.mockImplementation(({ variables }) => {
        // First call: fetch attribute definitions
        if (variables?.attributesSlugs) {
          return Promise.resolve({
            data: {
              attributes: {
                edges: [
                  {
                    node: {
                      slug: "page-ref-attr",
                      inputType: "REFERENCE",
                      entityType: AttributeEntityTypeEnum.PAGE,
                      id: "page-attr-id",
                      name: "Page Reference Attribute",
                      choices: { edges: [] },
                    },
                  },
                ],
              },
            },
          });
        }

        // Second call: fetch page choices
        if (variables?.pageSlugs) {
          return Promise.resolve({
            data: {
              pages: {
                edges: [
                  {
                    node: {
                      id: "page-id-1",
                      name: "Test Page",
                      slug: "page-slug-1",
                    },
                  },
                ],
              },
            },
          });
        }

        return Promise.resolve({ data: {} });
      });

      const { result } = renderHook(() => useProductInitialAPIState());

      // Act
      await act(async () => {
        await result.current.fetchQueries({
          category: [],
          collection: [],
          productType: [],
          channel: [],
          attribute: {},
          attributeReference: { "page-ref-attr": ["page-slug-1"] },
        });
      });

      // Assert
      expect(result.current.loading).toBe(false);
      expect(mockQuery).toHaveBeenCalledTimes(2);

      // First call should fetch attribute definitions
      expect(mockQuery).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          variables: expect.objectContaining({
            attributesSlugs: ["page-ref-attr"],
            choicesIds: [],
            first: 1,
          }),
        }),
      );

      // Second call should fetch page choices
      expect(mockQuery).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          variables: expect.objectContaining({
            pageSlugs: ["page-slug-1"],
            first: 1,
          }),
        }),
      );

      // Check that the attribute was properly processed
      expect(result.current.data.attribute["page-ref-attr"]).toBeDefined();
      expect(result.current.data.attribute["page-ref-attr"].entityType).toBe(
        AttributeEntityTypeEnum.PAGE,
      );
    });
  });

  describe("PRODUCT reference attribute", () => {
    it("should fetch attribute definition first, then fetch product choices based on entity type", async () => {
      // Arrange
      mockQuery.mockImplementation(({ variables }) => {
        // First call: fetch attribute definitions
        if (variables?.attributesSlugs) {
          return Promise.resolve({
            data: {
              attributes: {
                edges: [
                  {
                    node: {
                      slug: "product-ref-attr",
                      inputType: "REFERENCE",
                      entityType: AttributeEntityTypeEnum.PRODUCT,
                      id: "product-attr-id",
                      name: "Product Reference Attribute",
                      choices: { edges: [] },
                    },
                  },
                ],
              },
            },
          });
        }

        // Second call: fetch product choices
        if (variables?.productSlugs) {
          return Promise.resolve({
            data: {
              products: {
                edges: [
                  {
                    node: {
                      id: "product-id-1",
                      name: "Test Product",
                      slug: "product-slug-1",
                    },
                  },
                ],
              },
            },
          });
        }

        return Promise.resolve({ data: {} });
      });

      const { result } = renderHook(() => useProductInitialAPIState());

      // Act
      await act(async () => {
        await result.current.fetchQueries({
          category: [],
          collection: [],
          productType: [],
          channel: [],
          attribute: {},
          attributeReference: { "product-ref-attr": ["product-slug-1"] },
        });
      });

      // Assert
      expect(result.current.loading).toBe(false);
      expect(mockQuery).toHaveBeenCalledTimes(2);

      // Second call should fetch product choices
      expect(mockQuery).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          variables: expect.objectContaining({
            productSlugs: ["product-slug-1"],
            first: 1,
          }),
        }),
      );

      // Check that the attribute was properly processed
      expect(result.current.data.attribute["product-ref-attr"]).toBeDefined();
      expect(result.current.data.attribute["product-ref-attr"].entityType).toBe(
        AttributeEntityTypeEnum.PRODUCT,
      );
    });
  });

  describe("PRODUCT_VARIANT reference attribute", () => {
    it("should fetch attribute definition first, then fetch variant choices using IDs", async () => {
      // Arrange
      mockQuery.mockImplementation(({ variables }) => {
        // First call: fetch attribute definitions
        if (variables?.attributesSlugs) {
          return Promise.resolve({
            data: {
              attributes: {
                edges: [
                  {
                    node: {
                      slug: "variant-ref-attr",
                      inputType: "REFERENCE",
                      entityType: AttributeEntityTypeEnum.PRODUCT_VARIANT,
                      id: "variant-attr-id",
                      name: "Product Variant Reference Attribute",
                      choices: { edges: [] },
                    },
                  },
                ],
              },
            },
          });
        }

        // Second call: fetch variant choices (note: uses IDs, not slugs)
        if (variables?.ids) {
          return Promise.resolve({
            data: {
              productVariants: {
                edges: [
                  {
                    node: {
                      id: "variant-id-1",
                      name: "Test Variant",
                      slug: "variant-slug-1",
                      product: {
                        name: "Test Product",
                      },
                    },
                  },
                ],
              },
            },
          });
        }

        return Promise.resolve({ data: {} });
      });

      const { result } = renderHook(() => useProductInitialAPIState());

      // Act - Note: using IDs for variants, not slugs
      await act(async () => {
        await result.current.fetchQueries({
          category: [],
          collection: [],
          productType: [],
          channel: [],
          attribute: {},
          attributeReference: { "variant-ref-attr": ["variant-id-1"] },
        });
      });

      // Assert
      expect(result.current.loading).toBe(false);
      expect(mockQuery).toHaveBeenCalledTimes(2);

      // Second call should fetch variant choices using IDs
      expect(mockQuery).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          variables: expect.objectContaining({
            ids: ["variant-id-1"],
            first: 1,
          }),
        }),
      );

      // Check that the attribute was properly processed
      expect(result.current.data.attribute["variant-ref-attr"]).toBeDefined();
      expect(result.current.data.attribute["variant-ref-attr"].entityType).toBe(
        AttributeEntityTypeEnum.PRODUCT_VARIANT,
      );
    });
  });

  describe("unknown entity type", () => {
    it("should skip fetching choices for unknown entity type", async () => {
      // Arrange
      mockQuery.mockImplementation(({ variables }) => {
        // Only return attribute definition with unknown entity type
        if (variables?.attributesSlugs) {
          return Promise.resolve({
            data: {
              attributes: {
                edges: [
                  {
                    node: {
                      slug: "unknown-ref-attr",
                      inputType: "REFERENCE",
                      entityType: "UNKNOWN_TYPE",
                      id: "unknown-attr-id",
                      name: "Unknown Reference Attribute",
                      choices: { edges: [] },
                    },
                  },
                ],
              },
            },
          });
        }

        return Promise.resolve({ data: {} });
      });

      const { result } = renderHook(() => useProductInitialAPIState());

      // Act
      await act(async () => {
        await result.current.fetchQueries({
          category: [],
          collection: [],
          productType: [],
          channel: [],
          attribute: {},
          attributeReference: { "unknown-ref-attr": ["unknown-value"] },
        });
      });

      // Assert
      expect(result.current.loading).toBe(false);
      // Should only call once (for attribute definition), no second call for choices
      expect(mockQuery).toHaveBeenCalledTimes(1);

      // Check that the attribute was processed but no choices were fetched
      expect(result.current.data.attribute["unknown-ref-attr"]).toBeDefined();
      expect(result.current.data.attribute["unknown-ref-attr"].choices).toEqual([]);
    });
  });

  describe("multiple reference attributes", () => {
    it("should handle multiple reference attributes of different entity types correctly", async () => {
      // Arrange
      mockQuery.mockImplementation(({ variables }) => {
        // First call: fetch attribute definitions for both
        if (variables?.attributesSlugs?.includes("page-ref-attr")) {
          return Promise.resolve({
            data: {
              attributes: {
                edges: [
                  {
                    node: {
                      slug: "page-ref-attr",
                      inputType: "REFERENCE",
                      entityType: AttributeEntityTypeEnum.PAGE,
                      id: "page-attr-id",
                      name: "Page Reference Attribute",
                      choices: { edges: [] },
                    },
                  },
                  {
                    node: {
                      slug: "product-ref-attr",
                      inputType: "REFERENCE",
                      entityType: AttributeEntityTypeEnum.PRODUCT,
                      id: "product-attr-id",
                      name: "Product Reference Attribute",
                      choices: { edges: [] },
                    },
                  },
                ],
              },
            },
          });
        }

        // Handle page choices
        if (variables?.pageSlugs) {
          return Promise.resolve({
            data: {
              pages: {
                edges: [
                  {
                    node: {
                      id: "page-id-1",
                      name: "Test Page",
                      slug: "page-slug-1",
                    },
                  },
                ],
              },
            },
          });
        }

        // Handle product choices
        if (variables?.productSlugs) {
          return Promise.resolve({
            data: {
              products: {
                edges: [
                  {
                    node: {
                      id: "product-id-1",
                      name: "Test Product",
                      slug: "product-slug-1",
                    },
                  },
                ],
              },
            },
          });
        }

        return Promise.resolve({ data: {} });
      });

      const { result } = renderHook(() => useProductInitialAPIState());

      // Act
      await act(async () => {
        await result.current.fetchQueries({
          category: [],
          collection: [],
          productType: [],
          channel: [],
          attribute: {},
          attributeReference: {
            "page-ref-attr": ["page-slug-1"],
            "product-ref-attr": ["product-slug-1"],
          },
        });
      });

      // Assert
      expect(result.current.loading).toBe(false);
      // Should call 3 times: 1 for attributes, 1 for pages, 1 for products
      expect(mockQuery).toHaveBeenCalledTimes(3);

      // Check that both attributes were processed
      expect(result.current.data.attribute["page-ref-attr"]).toBeDefined();
      expect(result.current.data.attribute["page-ref-attr"].entityType).toBe(
        AttributeEntityTypeEnum.PAGE,
      );

      expect(result.current.data.attribute["product-ref-attr"]).toBeDefined();
      expect(result.current.data.attribute["product-ref-attr"].entityType).toBe(
        AttributeEntityTypeEnum.PRODUCT,
      );
    });
  });
});
