import { ASSIGN_VARIANT_LOAD_MORE_PAGE_SIZE } from "@dashboard/fragments/products";
import { type AssignableSearchProduct } from "@dashboard/searches/mapSearchProductsForVariantAssign";
import { act, renderHook } from "@testing-library/react";

import { useAssignVariantDialogProducts } from "./useAssignVariantDialogProducts";

const mockQuery = jest.fn();

jest.mock("@apollo/client", () => {
  const actual = jest.requireActual("@apollo/client");

  return {
    ...actual,
    useApolloClient: () => ({
      query: mockQuery,
    }),
  };
});

const baseProduct = (overrides: Partial<AssignableSearchProduct> = {}): AssignableSearchProduct => {
  const { channelListings = [], collections = [], ...rest } = overrides;
  const product: AssignableSearchProduct = {
    __typename: "Product",
    id: "product-1",
    name: "Product 1",
    thumbnail: null,
    productType: {
      __typename: "ProductType",
      id: "type-1",
      name: "Type",
    },
    channelListings,
    collections,
    variants: [
      {
        __typename: "ProductVariant",
        id: "v1",
        name: "v1",
        sku: "v1",
        product: {
          __typename: "Product",
          id: "product-1",
          name: "Product 1",
          thumbnail: null,
          productType: {
            __typename: "ProductType",
            id: "type-1",
            name: "Type",
          },
        },
        channelListings: [],
      },
    ],
    variantsTotalCount: 3,
    variantsHasNextPage: true,
    variantsEndCursor: "cursor-1",
    ...rest,
  };

  return product;
};

describe("useAssignVariantDialogProducts", () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  it("appends the next page without dropping the first page", async () => {
    // Arrange
    mockQuery.mockResolvedValue({
      data: {
        product: {
          id: "product-1",
          productVariants: {
            totalCount: 3,
            pageInfo: { hasNextPage: false, endCursor: "cursor-2" },
            edges: [
              {
                node: {
                  __typename: "ProductVariant",
                  id: "v2",
                  name: "v2",
                  sku: "v2",
                  product: {
                    __typename: "Product",
                    id: "product-1",
                    name: "Product 1",
                    thumbnail: null,
                    productType: {
                      __typename: "ProductType",
                      id: "type-1",
                      name: "Type",
                    },
                  },
                  channelListings: [],
                },
              },
              {
                node: {
                  __typename: "ProductVariant",
                  id: "v3",
                  name: "v3",
                  sku: "v3",
                  product: {
                    __typename: "Product",
                    id: "product-1",
                    name: "Product 1",
                    thumbnail: null,
                    productType: {
                      __typename: "ProductType",
                      id: "type-1",
                      name: "Type",
                    },
                  },
                  channelListings: [],
                },
              },
            ],
          },
        },
      },
    });

    const { result } = renderHook(() =>
      useAssignVariantDialogProducts({
        products: [baseProduct()],
        searchQuery: "",
        channel: "default-channel",
        open: true,
      }),
    );

    // Act
    await act(async () => {
      await result.current.loadMoreVariants("product-1");
    });

    // Assert
    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({
          id: "product-1",
          first: ASSIGN_VARIANT_LOAD_MORE_PAGE_SIZE,
          after: "cursor-1",
          channel: "default-channel",
        }),
        fetchPolicy: "no-cache",
      }),
    );
    expect(result.current.products[0].variants.map(variant => variant.id)).toEqual([
      "v1",
      "v2",
      "v3",
    ]);
    expect(result.current.products[0].variantsHasNextPage).toBe(false);
  });

  it("ignores in-flight load more after search/channel clear", async () => {
    // Arrange
    let resolveQuery: (value: unknown) => void = () => undefined;
    const pending = new Promise(resolve => {
      resolveQuery = resolve;
    });

    mockQuery.mockReturnValue(pending);

    const { result, rerender } = renderHook(
      ({ searchQuery, channel }) =>
        useAssignVariantDialogProducts({
          products: [baseProduct()],
          searchQuery,
          channel,
          open: true,
        }),
      {
        initialProps: { searchQuery: "", channel: "default-channel" as string | undefined },
      },
    );

    let loadPromise: Promise<void> = Promise.resolve();

    await act(async () => {
      loadPromise = result.current.loadMoreVariants("product-1");
    });

    // Act — clear overrides mid-flight
    rerender({ searchQuery: "shoes", channel: "default-channel" });

    await act(async () => {
      resolveQuery({
        data: {
          product: {
            id: "product-1",
            productVariants: {
              totalCount: 3,
              pageInfo: { hasNextPage: false, endCursor: "cursor-2" },
              edges: [
                {
                  node: {
                    __typename: "ProductVariant",
                    id: "v2",
                    name: "v2",
                    sku: "v2",
                    product: {
                      __typename: "Product",
                      id: "product-1",
                      name: "Product 1",
                      thumbnail: null,
                      productType: {
                        __typename: "ProductType",
                        id: "type-1",
                        name: "Type",
                      },
                    },
                    channelListings: [],
                  },
                },
              ],
            },
          },
        },
      });
      await loadPromise;
    });

    // Assert — stale page must not reappear as an override
    expect(result.current.products[0].variants.map(variant => variant.id)).toEqual(["v1"]);
    expect(result.current.loadingProductIds.has("product-1")).toBe(false);
  });
});
