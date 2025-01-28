import { useReorderProductsInCollectionMutation } from "@dashboard/graphql";
import { useLocalPaginationState } from "@dashboard/hooks/useLocalPaginator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { act, renderHook } from "@testing-library/react-hooks";

import { Product } from "./types";
import { useProductReorder } from "./useProductReorder";
import { useProductReorderOptimistic } from "./useProductReorderOptimistic";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: (x: unknown) => x,
}));

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

jest.mock("@dashboard/hooks/useNotifier", () => jest.fn());

describe("CollectionProducts/useProductReorder", () => {
  const mockReorder = jest.fn();
  const mockNotifier = jest.fn();
  const createForDroppedItem = jest.fn(() => "optimistic-response");
  const mockPaginationState = { page: 1, pageSize: 10 };

  beforeEach(() => {
    (useReorderProductsInCollectionMutation as jest.Mock).mockReturnValue([mockReorder, {}]);
    (useLocalPaginationState as jest.Mock).mockReturnValue([mockPaginationState]);
    (useProductReorderOptimistic as jest.Mock).mockReturnValue({
      createForDroppedItem: createForDroppedItem,
    });
    (useNotifier as jest.Mock).mockReturnValue(mockNotifier);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call reorder with correct variables when move is called", () => {
    // Arrange
    const { result } = renderHook(() =>
      useProductReorder({ paginationState: { first: 10, after: "1" } }),
    );
    const productIds = [
      { id: "1", name: "Product 1" },
      { id: "2", name: "Product 2" },
      { id: "3", name: "Product 3" },
    ] as Product[];
    const shift = 1;

    // Act
    act(() => {
      result.current.move(productIds, "2", shift);
    });

    // Assert
    expect(mockReorder).toHaveBeenCalledWith({
      variables: {
        after: "1",
        collectionId: "collection-id-1",
        first: 10,
        moves: [
          {
            productId: "2",
            sortOrder: 1,
          },
        ],
      },
      optimisticResponse: "optimistic-response",
    });
  });

  it("should return data from the mutation", () => {
    // Arrange & Act
    const { result } = renderHook(() =>
      useProductReorder({ paginationState: { first: 10, after: "1" } }),
    );

    // Assert
    expect(result.current.data).toEqual({});
  });
});
