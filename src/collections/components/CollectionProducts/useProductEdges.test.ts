import { useApolloClient } from "@apollo/client";
import { PaginationState } from "@dashboard/hooks/usePaginator";
import { renderHook } from "@testing-library/react-hooks";

import { useCollectionId } from "./useCollectionId";
import { useProductEdges } from "./useProductEdges";

jest.mock("@apollo/client");
jest.mock("@dashboard/graphql", () => ({
  CollectionProductsDocument: "CollectionProductsDocument",
}));
jest.mock("./useCollectionId");

describe("CollectionProducts/useProductEdges", () => {
  const mockCollectionId = "collection-123";
  const mockPaginationState = {
    first: 10,
    after: null,
  } as unknown as PaginationState;

  const mockProductEdges = [
    { node: { id: "1", name: "Product 1" } },
    { node: { id: "2", name: "Product 2" } },
  ];

  const mockQueryResponse = {
    collection: {
      products: {
        edges: mockProductEdges,
      },
    },
  };

  const mockReadQuery = jest.fn();
  const mockApolloClient = {
    readQuery: mockReadQuery,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useApolloClient as jest.Mock).mockReturnValue(mockApolloClient);
    (useCollectionId as jest.Mock).mockReturnValue(mockCollectionId);
    mockReadQuery.mockReturnValue(mockQueryResponse);
  });

  it("should return product edges when query is successful", () => {
    const { result } = renderHook(() => useProductEdges({ paginationState: mockPaginationState }));

    expect(mockReadQuery).toHaveBeenCalledWith({
      query: "CollectionProductsDocument",
      variables: {
        id: mockCollectionId,
        ...mockPaginationState,
      },
    });

    expect(result.current.edges).toEqual(mockProductEdges);
  });

  it("should return empty array when query returns null", () => {
    mockReadQuery.mockReturnValue(null);

    const { result } = renderHook(() => useProductEdges({ paginationState: mockPaginationState }));

    expect(result.current.edges).toEqual([]);
  });

  it("should return empty array when collection is null", () => {
    mockReadQuery.mockReturnValue({ collection: null });

    const { result } = renderHook(() => useProductEdges({ paginationState: mockPaginationState }));

    expect(result.current.edges).toEqual([]);
  });

  it("should return empty array when products is null", () => {
    mockReadQuery.mockReturnValue({
      collection: { products: null },
    });

    const { result } = renderHook(() => useProductEdges({ paginationState: mockPaginationState }));

    expect(result.current.edges).toEqual([]);
  });

  it("should pass pagination state to query", () => {
    const customPaginationState = {
      first: 20,
      after: "cursor-123",
    };

    renderHook(() => useProductEdges({ paginationState: customPaginationState }));

    expect(mockReadQuery).toHaveBeenCalledWith({
      query: expect.anything(),
      variables: {
        id: mockCollectionId,
        ...customPaginationState,
      },
    });
  });
});
