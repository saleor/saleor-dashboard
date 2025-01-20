import { renderHook } from "@testing-library/react-hooks";
import useRouter from "use-react-router";

import { useProductEdges } from "./useProductEdges";
import { useProductReorderOptimistic } from "./useProductReorderOptimistic";

jest.mock("use-react-router");
jest.mock("./useProductEdges");

describe("CollectionProducts/useProductReorderOptimistic", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      match: {
        params: { id: "collection-id-1" },
      },
    });
    (useProductEdges as jest.Mock).mockReturnValue({
      shift: jest.fn(),
      isShiftExceedPage: jest.fn(),
    });
  });

  it("should create optimistic response correctly when product is not moved to the next page", () => {
    // Arrange
    const mockShift = jest
      .fn()
      .mockReturnValue([
        { node: { id: "product1" } },
        { node: { id: "product3" } },
        { node: { id: "product2" } },
        { node: { id: "product4" } },
        { node: { id: "product5" } },
      ]);
    const mockIsShiftExceedPage = jest.fn().mockReturnValue({ exceededProductIds: [] });

    (useProductEdges as jest.Mock).mockReturnValue({
      shift: mockShift,
      isShiftExceedPage: mockIsShiftExceedPage,
    });

    // Act
    const { result } = renderHook(() =>
      useProductReorderOptimistic({ paginationState: { first: 10, after: "1" } }),
    );

    const response = result.current.createOptimisticResponse(["product3"], 1);

    // Assert
    expect(response).toEqual({
      collectionReorderProducts: {
        __typename: "CollectionReorderProducts",
        collection: {
          __typename: "Collection",
          id: "collection-id-1",
          products: {
            __typename: "ProductCountableConnection",
            edges: [
              { node: { id: "product1" } },
              { node: { id: "product3" } },
              { node: { id: "product2" } },
              { node: { id: "product4" } },
              { node: { id: "product5" } },
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

  it("should create optimistic response correctly when product is moved to the next page", () => {
    // Arrange
    const mockShift = jest
      .fn()
      .mockReturnValue([
        { node: { id: "product3" } },
        { node: { id: "product1" } },
        { node: { id: "product2" } },
        { node: { id: "product4" } },
        { node: { id: "product5" } },
      ]);

    // Act
    const mockIsShiftExceedPage = jest.fn().mockReturnValue({ exceededProductIds: ["product3"] });

    (useProductEdges as jest.Mock).mockReturnValue({
      shift: mockShift,
      isShiftExceedPage: mockIsShiftExceedPage,
    });

    const { result } = renderHook(() =>
      useProductReorderOptimistic({ paginationState: { first: 10, after: "1" } }),
    );

    const response = result.current.createOptimisticResponse(["product3"], 3);

    // Assert
    expect(response).toEqual({
      collectionReorderProducts: {
        __typename: "CollectionReorderProducts",
        collection: {
          __typename: "Collection",
          id: "collection-id-1",
          products: {
            __typename: "ProductCountableConnection",
            edges: [
              { node: { id: "optimistic_product3" } },
              { node: { id: "product1" } },
              { node: { id: "product2" } },
              { node: { id: "product4" } },
              { node: { id: "product5" } },
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
});
