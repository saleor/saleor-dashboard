import { PaginationState } from "@dashboard/hooks/usePaginator";
import { renderHook } from "@testing-library/react-hooks";

import { Product } from "./types";
import { useCollectionId } from "./useCollectionId";
import { useProductEdges } from "./useProductEdges";
import { useProductReorderOptimistic } from "./useProductReorderOptimistic";

jest.mock("./useCollectionId");
jest.mock("./useProductEdges");

const mockCollectionId = "collection-123";
const mockEdges = [
  {
    node: {
      id: "product-1",
      name: "Product 1",
    },
  },
  {
    node: {
      id: "product-2",
      name: "Product 2",
    },
  },
  {
    node: {
      id: "product-3",
      name: "Product 3",
    },
  },
];

(useCollectionId as jest.Mock).mockReturnValue(mockCollectionId);
(useProductEdges as jest.Mock).mockReturnValue({ edges: mockEdges });

describe("CollectionProducts/useProductReorderOptimistic", () => {
  const defaultPaginationState = {
    first: 10,
    after: null,
    last: null,
    before: null,
  } as unknown as PaginationState;

  beforeEach(() => {
    jest.clearAllMocks();
    (useCollectionId as jest.Mock).mockReturnValue(mockCollectionId);
    (useProductEdges as jest.Mock).mockReturnValue({ edges: mockEdges });
  });

  it("should create proper optimistic response for reordered products", () => {
    const { result } = renderHook(() =>
      useProductReorderOptimistic({ paginationState: defaultPaginationState }),
    );

    const products = [
      { id: "product-2", name: "Product 2" },
      { id: "product-1", name: "Product 1" },
      { id: "product-3", name: "Product 3" },
    ] as Product[];

    const activeNodeId = "product-1";
    const response = result.current.createForDroppedItem(products, activeNodeId);

    expect(response).toEqual({
      collectionReorderProducts: {
        __typename: "CollectionReorderProducts",
        collection: {
          __typename: "Collection",
          id: mockCollectionId,
          products: {
            __typename: "ProductCountableConnection",
            edges: [
              {
                node: {
                  id: "product-2",
                  name: "Product 2",
                },
              },
              {
                node: {
                  id: "moved_product-1",
                  name: "Product 1",
                },
              },
              {
                node: {
                  id: "product-3",
                  name: "Product 3",
                },
              },
            ],
            pageInfo: {
              __typename: "PageInfo",
              endCursor: null,
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: null,
            },
          },
        },
        errors: [],
      },
      __typename: "Mutation",
    });
  });

  it("should handle empty product list", () => {
    const { result } = renderHook(() =>
      useProductReorderOptimistic({ paginationState: defaultPaginationState }),
    );

    const products: Product[] = [];
    const activeNodeId = "product-1";
    const response = result.current.createForDroppedItem(products, activeNodeId);

    expect(response.collectionReorderProducts.collection.products.edges).toEqual([]);
  });

  it("should handle product not found in edges", () => {
    const { result } = renderHook(() =>
      useProductReorderOptimistic({ paginationState: defaultPaginationState }),
    );

    const products = [
      { id: "non-existent", name: "Non Existent Product" },
      { id: "product-1", name: "Product 1" },
    ] as Product[];

    const activeNodeId = "product-1";
    const response = result.current.createForDroppedItem(products, activeNodeId);

    expect(response.collectionReorderProducts.collection.products.edges).toEqual([
      {
        node: {
          id: "moved_product-1",
          name: "Product 1",
        },
      },
    ]);
  });

  it("should use correct collection ID from hook", () => {
    const customCollectionId = "custom-collection-123";

    (useCollectionId as jest.Mock).mockReturnValue(customCollectionId);

    const { result } = renderHook(() =>
      useProductReorderOptimistic({ paginationState: defaultPaginationState }),
    );

    const products = [{ id: "product-1", name: "Product 1" }] as Product[];
    const activeNodeId = "product-1";
    const response = result.current.createForDroppedItem(products, activeNodeId);

    expect(response.collectionReorderProducts.collection.id).toBe(customCollectionId);
  });

  it("should preserve edge properties when creating optimistic response", () => {
    const edgesWithExtraProps = [
      {
        node: {
          id: "product-1",
          name: "Product 1",
          extraProp: "extra value",
        },
        cursor: "cursor-1",
      },
    ];

    (useProductEdges as jest.Mock).mockReturnValue({ edges: edgesWithExtraProps });

    const { result } = renderHook(() =>
      useProductReorderOptimistic({ paginationState: defaultPaginationState }),
    );

    const products = [{ id: "product-1", name: "Product 1" }] as Product[];
    const activeNodeId = "product-1";
    const response = result.current.createForDroppedItem(products, activeNodeId);

    expect(response.collectionReorderProducts.collection.products.edges[0]).toMatchObject({
      node: {
        id: "moved_product-1",
        name: "Product 1",
        extraProp: "extra value",
      },
      cursor: "cursor-1",
    });
  });
});
