import { useReorderProductsInCollectionMutation } from "@dashboard/graphql";
import { useLocalPaginationState } from "@dashboard/hooks/useLocalPaginator";
import { act, renderHook } from "@testing-library/react-hooks";

import { useProductReorder } from "./useProductReorder";
import { useProductReorderOptimistic } from "./useProductReorderOptimistic";

jest.mock("@dashboard/graphql", () => ({
  useReorderProductsInCollectionMutation: jest.fn(),
}));

jest.mock("@dashboard/hooks/useLocalPaginator", () => ({
  useLocalPaginationState: jest.fn(),
}));

jest.mock("./useProductReorderOptimistic", () => ({
  useProductReorderOptimistic: jest.fn(),
}));

jest.mock("./useCollectionId", () => ({
  useCollectionId: jest.fn(() => "collection-id-1"),
}));

describe("CollectionProducts/useProductReorder", () => {
  const mockReorder = jest.fn();
  const mockCreateOptimisticResponse = jest.fn();
  const mockPaginationState = { page: 1, pageSize: 10 };

  beforeEach(() => {
    (useReorderProductsInCollectionMutation as jest.Mock).mockReturnValue([mockReorder, {}]);
    (useLocalPaginationState as jest.Mock).mockReturnValue([mockPaginationState]);
    (useProductReorderOptimistic as jest.Mock).mockReturnValue({
      createOptimisticResponse: mockCreateOptimisticResponse,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call reorder with correct variables when move is called", () => {
    // Arrange
    const { result } = renderHook(() => useProductReorder());
    const productIds = ["1", "2", "3"];
    const shift = 1;

    // Act
    act(() => {
      result.current.move(productIds, shift);
    });

    // Assert
    expect(mockReorder).toHaveBeenCalledWith({
      variables: {
        collectionId: "collection-id-1",
        moves: [
          {
            productId: "1",
            sortOrder: 1,
          },
          {
            productId: "2",
            sortOrder: 1,
          },
          {
            productId: "3",
            sortOrder: 1,
          },
        ],
        page: 1,
        pageSize: 10,
      },
    });
  });

  it("should return data from the mutation", () => {
    const { result } = renderHook(() => useProductReorder());

    expect(result.current.data).toEqual({});
  });
});
