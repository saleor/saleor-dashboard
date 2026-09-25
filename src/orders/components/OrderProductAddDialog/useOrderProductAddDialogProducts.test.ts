import { type AddressInput } from "@dashboard/graphql";
import { type OrderSearchProduct } from "@dashboard/searches/mapSearchOrderVariantsForAdd";
import { ORDER_PRODUCT_ADD_VARIANTS_PAGE_SIZE } from "@dashboard/searches/useOrderVariantSearch";
import { act, renderHook, waitFor } from "@testing-library/react";

import { useOrderProductAddDialogProducts } from "./useOrderProductAddDialogProducts";

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

const operationName = (query: { definitions: Array<{ name?: { value?: string } }> }) =>
  query.definitions[0]?.name?.value;

const variantNode = (id: string, priced = false) => ({
  __typename: "ProductVariant" as const,
  id,
  name: id,
  sku: id,
  pricing: priced
    ? {
        __typename: "VariantPricingInfo" as const,
        onSale: false,
        price: {
          __typename: "TaxedMoney" as const,
          gross: { __typename: "Money" as const, amount: 1, currency: "USD" },
        },
        priceUndiscounted: {
          __typename: "TaxedMoney" as const,
          gross: { __typename: "Money" as const, amount: 1, currency: "USD" },
        },
      }
    : null,
});

const baseProduct = (overrides: Partial<OrderSearchProduct> = {}): OrderSearchProduct => ({
  __typename: "Product",
  id: "product-1",
  name: "Product 1",
  thumbnail: null,
  variants: [variantNode("v1")],
  variantsTotalCount: 3,
  variantsHasNextPage: true,
  channelVariantIds: null,
  missingVariantIds: [],
  ...overrides,
});

const idsResult = (ids: string[]) => ({
  data: {
    product: {
      id: "product-1",
      variants: ids.map(id => ({ id })),
    },
  },
});

const detailsResult = (ids: string[], priced = true) => ({
  data: {
    productVariants: {
      edges: ids.map(id => ({ node: variantNode(id, priced) })),
    },
  },
});

describe("useOrderProductAddDialogProducts", () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  it("loads channel ids once, then the next page of missing ids", async () => {
    // Arrange
    const channelIds = Array.from(
      { length: ORDER_PRODUCT_ADD_VARIANTS_PAGE_SIZE + 2 },
      (_, index) => `v${index + 1}`,
    );

    mockQuery.mockImplementation(
      async ({ query }: { query: { definitions: Array<{ name?: { value?: string } }> } }) => {
        if (operationName(query) === "OrderProductChannelVariantIds") {
          return idsResult(channelIds);
        }

        return detailsResult(channelIds.slice(1, ORDER_PRODUCT_ADD_VARIANTS_PAGE_SIZE + 1));
      },
    );

    const { result } = renderHook(() =>
      useOrderProductAddDialogProducts({
        products: [baseProduct()],
        searchQuery: "",
        channel: "default-channel",
        address: undefined as AddressInput | undefined,
        open: true,
      }),
    );

    // Act
    await act(async () => {
      await result.current.loadMoreVariants("product-1");
    });

    // Assert
    expect(mockQuery).toHaveBeenCalledTimes(2);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({
          ids: channelIds.slice(1, ORDER_PRODUCT_ADD_VARIANTS_PAGE_SIZE + 1),
          channel: "default-channel",
        }),
        fetchPolicy: "no-cache",
      }),
    );
    expect(result.current.products[0].missingVariantIds).toEqual([
      channelIds[ORDER_PRODUCT_ADD_VARIANTS_PAGE_SIZE + 1],
    ]);

    mockQuery.mockClear();
    mockQuery.mockResolvedValue(
      detailsResult([channelIds[ORDER_PRODUCT_ADD_VARIANTS_PAGE_SIZE + 1]]),
    );

    await act(async () => {
      await result.current.loadMoreVariants("product-1");
    });

    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(operationName(mockQuery.mock.calls[0][0].query)).toBe("OrderProductVariantsForAdd");
    expect(result.current.products[0].missingVariantIds).toEqual([]);
  });

  it("auto-loads once when a truncated product has no priced variants", async () => {
    // Arrange
    mockQuery.mockImplementation(
      async ({ query }: { query: { definitions: Array<{ name?: { value?: string } }> } }) => {
        if (operationName(query) === "OrderProductChannelVariantIds") {
          return idsResult(["v51", "v52"]);
        }

        return detailsResult(["v51", "v52"]);
      },
    );

    const { result } = renderHook(() =>
      useOrderProductAddDialogProducts({
        products: [baseProduct({ variants: [variantNode("v1")] })],
        searchQuery: "",
        channel: "default-channel",
        address: undefined as AddressInput | undefined,
        open: true,
      }),
    );

    // Act // Assert
    await waitFor(() => {
      expect(result.current.products[0].variants.map(variant => variant.id)).toEqual([
        "v51",
        "v52",
      ]);
    });
    expect(mockQuery).toHaveBeenCalledTimes(2);
  });

  it("auto-loads the first product when only a few priced variants are showing", async () => {
    // Arrange
    mockQuery.mockImplementation(
      async ({ query }: { query: { definitions: Array<{ name?: { value?: string } }> } }) => {
        if (operationName(query) === "OrderProductChannelVariantIds") {
          return idsResult(["v1", "v51"]);
        }

        return detailsResult(["v51"]);
      },
    );

    const { result } = renderHook(() =>
      useOrderProductAddDialogProducts({
        products: [
          baseProduct({ variants: [variantNode("v1", true)] }),
          baseProduct({
            id: "product-2",
            variants: [variantNode("v2", true)],
          }),
        ],
        searchQuery: "",
        channel: "default-channel",
        address: undefined as AddressInput | undefined,
        open: true,
      }),
    );

    // Act // Assert
    await waitFor(() => {
      expect(result.current.products[0].channelVariantIds).toEqual(["v1", "v51"]);
    });
    expect(mockQuery.mock.calls.map(call => call[0].variables.id ?? call[0].variables.ids)).toEqual(
      expect.arrayContaining(["product-1"]),
    );
    expect(mockQuery.mock.calls.some(call => call[0].variables.id === "product-2")).toBe(false);
    expect(result.current.products[1].channelVariantIds).toBeNull();
  });

  it("treats the first visible product as first, skipping hidden ones", async () => {
    // Arrange
    mockQuery.mockImplementation(
      async ({ query }: { query: { definitions: Array<{ name?: { value?: string } }> } }) => {
        if (operationName(query) === "OrderProductChannelVariantIds") {
          return idsResult(["v2", "v52"]);
        }

        return detailsResult(["v52"]);
      },
    );

    const { result } = renderHook(() =>
      useOrderProductAddDialogProducts({
        products: [
          // Fully loaded, nothing priced: the dialog hides this one.
          baseProduct({ id: "hidden", variants: [variantNode("v1")], variantsHasNextPage: false }),
          baseProduct({ id: "product-2", variants: [variantNode("v2", true)] }),
        ],
        searchQuery: "",
        channel: "default-channel",
        address: undefined as AddressInput | undefined,
        open: true,
      }),
    );

    // Act // Assert
    await waitFor(() => {
      expect(result.current.products[1].channelVariantIds).toEqual(["v2", "v52"]);
    });
    expect(mockQuery.mock.calls.some(call => call[0].variables.id === "hidden")).toBe(false);
  });

  it("does not auto-load the first product when its priced list is already long enough", async () => {
    // Arrange
    const { result } = renderHook(() =>
      useOrderProductAddDialogProducts({
        products: [
          baseProduct({
            variants: ["v1", "v2", "v3", "v4"].map(id => variantNode(id, true)),
          }),
        ],
        searchQuery: "",
        channel: "default-channel",
        address: undefined as AddressInput | undefined,
        open: true,
      }),
    );

    // Act
    await act(async () => {
      await Promise.resolve();
    });

    // Assert
    expect(mockQuery).not.toHaveBeenCalled();
    expect(result.current.products[0].variants).toHaveLength(4);
  });

  it("ignores in-flight load more after search clear", async () => {
    // Arrange
    let resolveQuery: (value: unknown) => void = () => undefined;
    const pending = new Promise(resolve => {
      resolveQuery = resolve;
    });

    mockQuery.mockReturnValue(pending);

    const { result, rerender } = renderHook(
      ({ searchQuery }) =>
        useOrderProductAddDialogProducts({
          products: [
            baseProduct({
              variants: ["v1", "v2", "v3", "v4"].map(id => variantNode(id, true)),
            }),
          ],
          searchQuery,
          channel: "default-channel",
          address: undefined as AddressInput | undefined,
          open: true,
        }),
      { initialProps: { searchQuery: "" } },
    );

    let loadPromise: Promise<void> = Promise.resolve();

    await act(async () => {
      loadPromise = result.current.loadMoreVariants("product-1");
    });

    rerender({ searchQuery: "boots" });

    await act(async () => {
      resolveQuery(idsResult(["v2"]));
      await loadPromise;
    });

    // Assert
    expect(result.current.products[0].variants.map(variant => variant.id)).toEqual([
      "v1",
      "v2",
      "v3",
      "v4",
    ]);
    expect(result.current.loadingProductIds.has("product-1")).toBe(false);
  });
});
