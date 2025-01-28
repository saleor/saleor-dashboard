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

  it("should return product edges when query cache exists", () => {
    // Arrange & Act
    const { result } = renderHook(() => useProductEdges({ paginationState: mockPaginationState }));

    // Assert
    expect(mockReadQuery).toHaveBeenCalledWith({
      query: "CollectionProductsDocument",
      variables: {
        id: mockCollectionId,
        ...mockPaginationState,
      },
    });

    expect(result.current.edges).toEqual(mockProductEdges);
  });

  it("should return empty array when query cache is empty", () => {
    // Arrange
    mockReadQuery.mockReturnValue(null);

    // Act
    const { result } = renderHook(() => useProductEdges({ paginationState: mockPaginationState }));

    // Assert
    expect(result.current.edges).toEqual([]);
  });

  it("should return empty array when collection is empty", () => {
    // Arrange
    mockReadQuery.mockReturnValue({ collection: null });

    // Act
    const { result } = renderHook(() => useProductEdges({ paginationState: mockPaginationState }));

    // Assert
    expect(result.current.edges).toEqual([]);
  });

  it("should return empty array when there are no products", () => {
    // Arrange
    mockReadQuery.mockReturnValue({
      collection: { products: null },
    });

    // Act
    const { result } = renderHook(() => useProductEdges({ paginationState: mockPaginationState }));

    // Assert
    expect(result.current.edges).toEqual([]);
  });

  it("should pass pagination state to query", () => {
    // Arrange
    const customPaginationState = {
      first: 20,
      after: "cursor-123",
    };

    // Act
    renderHook(() => useProductEdges({ paginationState: customPaginationState }));

    // Assert
    expect(mockReadQuery).toHaveBeenCalledWith({
      query: expect.anything(),
      variables: {
        id: mockCollectionId,
        ...customPaginationState,
      },
    });
  });
});
