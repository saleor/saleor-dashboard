import { renderHook } from "@testing-library/react-hooks";

import { useSearchCache } from "./useSearchCache";

describe("useSearchCache", () => {
  const data = {
    search: {
      edges: [
        { node: { id: "1", name: "Item 1" } },
        { node: { id: "2", name: "Item 2" } },
      ],
      pageInfo: {
        __typename: "PageInfo" as const,
        startCursor: null,
        endCursor: null,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    },
  };

  it("returns an empty array initially", () => {
    const { result } = renderHook(() => useSearchCache(undefined));
    expect(result.current).toEqual([]);
  });

  it("adds items to the cache when data is provided", () => {
    const { result, rerender } = renderHook(() => useSearchCache(undefined));

    rerender({ currentData: data });
    expect(result.current).toEqual([
      { id: "1", name: "Item 1" },
      { id: "2", name: "Item 2" },
    ]);
  });

  it("does not add duplicate items to the cache", () => {
    const { result, rerender } = renderHook(() => useSearchCache(data));

    // Add the same data again
    rerender({ currentData: data });
    expect(result.current).toEqual([
      { id: "1", name: "Item 1" },
      { id: "2", name: "Item 2" },
    ]);
  });
});
