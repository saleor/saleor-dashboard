import { useApolloClient } from "@apollo/client";
import { renderHook } from "@testing-library/react-hooks";

import { useProductEdges } from "./useProductEdges";

jest.mock("@apollo/client");
jest.mock("./useCollectionId");

describe("CollectionProducts/useProductEdges", () => {
  const mockReadQuery = jest.fn();
  const mockClient = { readQuery: mockReadQuery };

  beforeEach(() => {
    (useApolloClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("shifts a single product", () => {
    mockReadQuery.mockReturnValue({
      collection: {
        products: {
          edges: [
            { node: { id: "1" } },
            { node: { id: "2" } },
            { node: { id: "3" } },
            { node: { id: "4" } },
          ],
        },
      },
    });

    const { result } = renderHook(() =>
      useProductEdges({ paginationState: { first: 10, after: "1" } }),
    );
    const shiftedEdges = result.current.shift(["3"], 1);

    expect(shiftedEdges).toEqual([
      { node: { id: "1" } },
      { node: { id: "2" } },
      { node: { id: "4" } },
      { node: { id: "3" } },
    ]);
  });

  it("shifts multiple products down", () => {
    mockReadQuery.mockReturnValue({
      collection: {
        products: {
          edges: [
            { node: { id: "1" } },
            { node: { id: "2" } },
            { node: { id: "3" } },
            { node: { id: "4" } },
            { node: { id: "5" } },
            { node: { id: "6" } },
            { node: { id: "7" } },
          ],
        },
      },
    });

    const { result } = renderHook(() =>
      useProductEdges({ paginationState: { first: 10, after: "1" } }),
    );
    const shiftedEdges = result.current.shift(["1", "2"], 1);

    expect(shiftedEdges).toEqual([
      { node: { id: "3" } },
      { node: { id: "1" } },
      { node: { id: "2" } },
      { node: { id: "4" } },
      { node: { id: "5" } },
      { node: { id: "6" } },
      { node: { id: "7" } },
    ]);
  });

  it("shifts multiple and random products down", () => {
    mockReadQuery.mockReturnValue({
      collection: {
        products: {
          edges: [
            { node: { id: "1" } },
            { node: { id: "2" } },
            { node: { id: "3" } },
            { node: { id: "4" } },
            { node: { id: "5" } },
            { node: { id: "6" } },
            { node: { id: "7" } },
          ],
        },
      },
    });

    const { result } = renderHook(() =>
      useProductEdges({ paginationState: { first: 10, after: "1" } }),
    );
    const shiftedEdges = result.current.shift(["1", "4", "6"], 1);

    expect(shiftedEdges).toEqual([
      { node: { id: "2" } },
      { node: { id: "1" } },
      { node: { id: "3" } },
      { node: { id: "5" } },
      { node: { id: "4" } },
      { node: { id: "7" } },
      { node: { id: "6" } },
    ]);
  });

  it("shifts multiple single products up", () => {
    mockReadQuery.mockReturnValue({
      collection: {
        products: {
          edges: [
            { node: { id: "1" } },
            { node: { id: "2" } },
            { node: { id: "3" } },
            { node: { id: "4" } },
            { node: { id: "5" } },
            { node: { id: "6" } },
            { node: { id: "7" } },
          ],
        },
      },
    });

    const { result } = renderHook(() =>
      useProductEdges({ paginationState: { first: 10, after: "1" } }),
    );
    const shiftedEdges = result.current.shift(["5", "6"], -1);

    expect(shiftedEdges).toEqual([
      { node: { id: "1" } },
      { node: { id: "2" } },
      { node: { id: "3" } },
      { node: { id: "5" } },
      { node: { id: "6" } },
      { node: { id: "4" } },
      { node: { id: "7" } },
    ]);
  });

  it("shifts multiple random products up", () => {
    mockReadQuery.mockReturnValue({
      collection: {
        products: {
          edges: [
            { node: { id: "1" } },
            { node: { id: "2" } },
            { node: { id: "3" } },
            { node: { id: "4" } },
            { node: { id: "5" } },
            { node: { id: "6" } },
            { node: { id: "7" } },
          ],
        },
      },
    });

    const { result } = renderHook(() =>
      useProductEdges({ paginationState: { first: 10, after: "1" } }),
    );
    const shiftedEdges = result.current.shift(["2", "3", "6"], -1);

    expect(shiftedEdges).toEqual([
      { node: { id: "2" } },
      { node: { id: "3" } },
      { node: { id: "1" } },
      { node: { id: "4" } },
      { node: { id: "6" } },
      { node: { id: "5" } },
      { node: { id: "7" } },
    ]);
  });

  it("should identify if shift exceeds page", () => {
    mockReadQuery.mockReturnValue({
      collection: {
        products: {
          edges: [
            { node: { id: "1" } },
            { node: { id: "2" } },
            { node: { id: "3" } },
            { node: { id: "4" } },
          ],
        },
      },
    });

    const { result } = renderHook(() =>
      useProductEdges({ paginationState: { first: 10, after: "1" } }),
    );
    const { isExceed, exceededProductIds } = result.current.isShiftExceedPage(["1"], -1);

    expect(isExceed).toBe(true);
    expect(exceededProductIds).toEqual(["1"]);
  });
});
