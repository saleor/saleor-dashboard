import {
  type ProductVariantSiblingFragment,
  type ProductVariantSiblingsQuery,
  useProductVariantSiblingsQuery,
} from "@dashboard/graphql";
import { act, renderHook } from "@testing-library/react";

import { useProductVariantSiblings } from "./useProductVariantSiblings";

jest.mock("@dashboard/graphql", () => {
  const actual = jest.requireActual<typeof import("@dashboard/graphql")>("@dashboard/graphql");

  return {
    ...actual,
    useProductVariantSiblingsQuery: jest.fn(),
  };
});

const mockedQuery = useProductVariantSiblingsQuery as jest.MockedFunction<
  typeof useProductVariantSiblingsQuery
>;

type QueryResult = ReturnType<typeof useProductVariantSiblingsQuery>;

const productId = "product";

const variant = (id: string): ProductVariantSiblingFragment => ({
  __typename: "ProductVariant",
  id,
  name: `Variant ${id}`,
  sku: `SKU-${id}`,
  media: [],
});

const siblingsData = (
  ids: string[],
  endCursor: string | null = null,
): ProductVariantSiblingsQuery => ({
  __typename: "Query",
  product: {
    __typename: "Product",
    id: productId,
    productVariants: {
      __typename: "ProductVariantCountableConnection",
      totalCount: ids.length,
      pageInfo: {
        __typename: "PageInfo",
        hasNextPage: endCursor !== null,
        hasPreviousPage: false,
        endCursor,
      },
      edges: ids.map(id => ({ __typename: "ProductVariantCountableEdge", node: variant(id) })),
    },
  },
});

/** The cache, as far as the hook touches it. */
const client = {
  readQuery: jest.fn<ProductVariantSiblingsQuery | null, [{ variables: unknown }]>(),
  writeQuery: jest.fn<void, [{ variables: unknown; data: ProductVariantSiblingsQuery }]>(),
};

// Only the fields the hook reads; the rest of Apollo's result is irrelevant here.
const queryResult = (result: Partial<QueryResult>): QueryResult =>
  ({
    loading: false,
    fetchMore: jest.fn(),
    refetch: jest.fn(),
    client,
    ...result,
  }) as unknown as QueryResult;

const listedIds = (data: ProductVariantSiblingsQuery): string[] =>
  data.product?.productVariants?.edges.map(edge => edge.node.id) ?? [];

/** How the latest request reads the list: from the API, or from what is already loaded. */
const requestedFetchPolicy = (): string | undefined =>
  mockedQuery.mock.calls.at(-1)?.[0].fetchPolicy;

/** Search term of the latest request the hook made. */
const requestedSearch = (): string | null | undefined =>
  mockedQuery.mock.calls.at(-1)?.[0].variables?.search;

beforeEach(() => {
  jest.useFakeTimers();
  mockedQuery.mockReset();
  client.readQuery.mockReset();
  client.writeQuery.mockReset();
  mockedQuery.mockReturnValue(queryResult({ data: siblingsData(["a", "b", "c"]) }));
});

afterEach(() => {
  jest.useRealTimers();
});

describe("useProductVariantSiblings", () => {
  it("searches once typing pauses", () => {
    // Arrange
    const { result } = renderHook(() => useProductVariantSiblings({ productId }));

    // Act
    act(() => result.current.setSearch("b"));

    // Assert: not yet, the keystroke is still waiting
    expect(requestedSearch()).toBeUndefined();

    // Act
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Assert
    expect(requestedSearch()).toBe("b");
  });

  it("does not apply a keystroke that was cleared before typing paused", () => {
    // Arrange
    const { result } = renderHook(() => useProductVariantSiblings({ productId }));

    // Act: type, then clear within the pause
    act(() => result.current.setSearch("b"));
    act(() => result.current.setSearch(""));
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Assert
    expect(requestedSearch()).toBeUndefined();
    expect(result.current.search).toBe("");
    expect(result.current.filtered).toBe(false);
  });

  it("reports the list as filtered from the first keystroke until the search is cleared", () => {
    // Arrange
    const { result } = renderHook(() => useProductVariantSiblings({ productId }));

    // Assert
    expect(result.current.filtered).toBe(false);

    // Act
    act(() => result.current.setSearch("b"));

    // Assert: the rows are still unfiltered, but about to change
    expect(result.current.filtered).toBe(true);

    // Act
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Assert
    expect(result.current.filtered).toBe(true);

    // Act
    act(() => result.current.setSearch(""));

    // Assert
    expect(result.current.filtered).toBe(false);
  });

  describe("reorder", () => {
    it("puts a saved order into the product's whole list, keeping every loaded variant", () => {
      // Arrange: a fourth variant was loaded after the order was made
      client.readQuery.mockReturnValue(siblingsData(["a", "b", "c", "d"]));

      const { result } = renderHook(() => useProductVariantSiblings({ productId }));

      // Act
      act(() => result.current.reorder(["c", "a", "b"]));

      // Assert
      expect(client.writeQuery).toHaveBeenCalledTimes(1);
      expect(listedIds(client.writeQuery.mock.calls[0][0].data)).toEqual(["c", "a", "b", "d"]);
    });

    it("writes to the whole list even while a search is on screen", () => {
      // Arrange: a search was typed while the move was being saved
      client.readQuery.mockReturnValue(siblingsData(["a", "b", "c"]));

      const { result } = renderHook(() => useProductVariantSiblings({ productId }));

      act(() => result.current.setSearch("b"));
      act(() => {
        jest.advanceTimersByTime(300);
      });
      expect(requestedSearch()).toBe("b");

      // Act
      act(() => result.current.reorder(["c", "a", "b"]));

      // Assert: read from and written to the list without the search
      const wholeList = { id: productId, first: 30 };

      expect(client.readQuery.mock.calls[0][0].variables).toEqual(wholeList);
      expect(client.writeQuery.mock.calls[0][0].variables).toEqual(wholeList);
    });

    it("leaves the cache alone when the whole list is not in it", () => {
      // Arrange
      client.readQuery.mockReturnValue(null);

      const { result } = renderHook(() => useProductVariantSiblings({ productId }));

      // Act
      act(() => result.current.reorder(["c", "a", "b"]));

      // Assert
      expect(client.writeQuery).not.toHaveBeenCalled();
    });
  });

  describe("asking the API", () => {
    it("asks the API for the whole list until it has answered", () => {
      // Arrange
      mockedQuery.mockReturnValue(queryResult({ data: undefined, loading: true }));

      // Act
      renderHook(() => useProductVariantSiblings({ productId }));

      // Assert
      expect(requestedFetchPolicy()).toBe("cache-and-network");
    });

    it("asks the API for every search", () => {
      // Arrange
      const { result } = renderHook(() => useProductVariantSiblings({ productId }));

      // Act
      act(() => result.current.setSearch("b"));
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Assert
      expect(requestedSearch()).toBe("b");
      expect(requestedFetchPolicy()).toBe("cache-and-network");
    });

    it("shows the whole list as it was left when a search is cleared", () => {
      // Arrange: the list has loaded, then a search was made
      const { result } = renderHook(() => useProductVariantSiblings({ productId }));

      act(() => result.current.setSearch("b"));
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Act
      act(() => result.current.setSearch(""));

      // Assert: read from what is loaded, so pages loaded after the first one stay
      expect(requestedSearch()).toBeUndefined();
      expect(requestedFetchPolicy()).toBe("cache-first");
    });

    it("asks the API again for another product", () => {
      // Arrange
      const { rerender } = renderHook(
        ({ id }: { id: string }) => useProductVariantSiblings({ productId: id }),
        { initialProps: { id: productId } },
      );

      // Act
      mockedQuery.mockReturnValue(queryResult({ data: undefined, loading: true }));
      rerender({ id: "another-product" });

      // Assert
      expect(requestedFetchPolicy()).toBe("cache-and-network");
    });
  });

  describe("loadMore", () => {
    const fetchMore = jest.fn();

    beforeEach(() => {
      fetchMore.mockReset();
      fetchMore.mockResolvedValue({});
    });

    it("asks for the page after the last loaded variant", () => {
      // Arrange
      mockedQuery.mockReturnValue(
        queryResult({ data: siblingsData(["a", "b"], "cursor-b"), fetchMore }),
      );

      const { result } = renderHook(() => useProductVariantSiblings({ productId }));
      let started = false;

      // Act
      act(() => {
        started = result.current.loadMore();
      });

      // Assert
      expect(started).toBe(true);
      expect(fetchMore.mock.calls[0][0].variables).toMatchObject({ after: "cursor-b" });
    });

    it("does not start a second request while one is on its way", () => {
      // Arrange
      mockedQuery.mockReturnValue(
        queryResult({ data: siblingsData(["a", "b"], "cursor-b"), fetchMore }),
      );

      const { result } = renderHook(() => useProductVariantSiblings({ productId }));
      let startedAgain = true;

      // Act
      act(() => {
        result.current.loadMore();
        startedAgain = result.current.loadMore();
      });

      // Assert
      expect(startedAgain).toBe(false);
      expect(fetchMore).toHaveBeenCalledTimes(1);
    });

    it("does not continue an earlier list while a search is still loading", () => {
      // Arrange: the rows on screen (and their cursor) are from before the search
      mockedQuery.mockReturnValue(
        queryResult({
          data: undefined,
          previousData: siblingsData(["a", "b"], "cursor-b"),
          loading: true,
          fetchMore,
        }),
      );

      const { result } = renderHook(() => useProductVariantSiblings({ productId }));
      let started = true;

      // Act
      act(() => {
        started = result.current.loadMore();
      });

      // Assert
      expect(started).toBe(false);
      expect(fetchMore).not.toHaveBeenCalled();
    });

    it("has nothing to ask for on the last page", () => {
      // Arrange
      mockedQuery.mockReturnValue(queryResult({ data: siblingsData(["a", "b"]), fetchMore }));

      const { result } = renderHook(() => useProductVariantSiblings({ productId }));
      let started = true;

      // Act
      act(() => {
        started = result.current.loadMore();
      });

      // Assert
      expect(started).toBe(false);
      expect(fetchMore).not.toHaveBeenCalled();
    });
  });

  it("does not apply a search typed for one product to the next one", () => {
    // Arrange
    const { result, rerender } = renderHook(
      ({ id }: { id: string }) => useProductVariantSiblings({ productId: id }),
      { initialProps: { id: productId } },
    );

    act(() => result.current.setSearch("red"));

    // Act: another product opens before typing has paused
    rerender({ id: "another-product" });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Assert
    expect(mockedQuery.mock.calls.at(-1)?.[0].variables?.id).toBe("another-product");
    expect(requestedSearch()).toBeUndefined();
    expect(result.current.search).toBe("");
  });

  it("allows reordering only while the rows are the product's own order", () => {
    // Arrange
    const { result } = renderHook(() => useProductVariantSiblings({ productId }));

    // Assert
    expect(result.current.canReorder).toBe(true);

    // Act: a search is typed, its results not in yet
    act(() => result.current.setSearch("b"));

    // Assert
    expect(result.current.canReorder).toBe(false);

    // Act: cleared again, but the full list still has to load and the old results stand in
    mockedQuery.mockReturnValue(
      queryResult({ data: undefined, previousData: siblingsData(["b"]), loading: true }),
    );
    act(() => result.current.setSearch(""));

    // Assert
    expect(result.current.search).toBe("");
    expect(result.current.canReorder).toBe(false);
  });

  it("reports the list as filtered while earlier search results stand in for a loading list", () => {
    // Arrange: the search was cleared, but the full list is still loading
    mockedQuery.mockReturnValue(
      queryResult({ data: undefined, previousData: siblingsData(["b"]), loading: true }),
    );

    // Act
    const { result } = renderHook(() => useProductVariantSiblings({ productId }));

    // Assert
    expect(result.current.variants.map(sibling => sibling.id)).toEqual(["b"]);
    expect(result.current.filtered).toBe(true);
  });
});
