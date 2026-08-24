import { act, renderHook } from "@testing-library/react";

import useAttributeValueSearchHandler from "./attributeValueSearchHandler";

const mockSearch = jest.fn();
const mockLoadMore = jest.fn();
let mockResult = {
  data: {
    attribute: {
      id: "attr-1",
      choices: {
        edges: [{ node: { id: "v1", name: "Red", slug: "red" } }],
        pageInfo: { hasNextPage: false },
      },
    },
  },
  loading: false,
};

jest.mock("@dashboard/searches/useAttributeValueSearch", () => ({
  __esModule: true,
  default: () => ({
    loadMore: mockLoadMore,
    search: mockSearch,
    result: mockResult,
  }),
}));

describe("useAttributeValueSearchHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockResult = {
      data: {
        attribute: {
          id: "attr-1",
          choices: {
            edges: [{ node: { id: "v1", name: "Red", slug: "red" } }],
            pageInfo: { hasNextPage: false },
          },
        },
      },
      loading: false,
    };
  });

  const renderSearchHandler = () =>
    renderHook(() =>
      useAttributeValueSearchHandler({
        id: "attr-1",
        first: 20,
        query: "",
      }),
    );

  it("should cache choices per attribute and keep them after reset", () => {
    // Arrange
    const { result } = renderSearchHandler();

    // Act
    act(() => {
      result.current.search("", "attr-1");
    });

    // Assert
    expect(result.current.getChoices("attr-1")).toEqual([{ id: "v1", name: "Red", slug: "red" }]);
    expect(result.current.getChoices("attr-2")).toEqual([]);

    act(() => {
      result.current.reset();
    });

    expect(result.current.getChoices("attr-1")).toEqual([{ id: "v1", name: "Red", slug: "red" }]);
    expect(result.current.getFetchMore("attr-1").hasMore).toBe(false);
  });

  it("should not write another attribute's payload into the active cache", () => {
    // Arrange — result still belongs to attr-1 while we search attr-2
    const { result } = renderSearchHandler();

    act(() => {
      result.current.search("", "attr-2");
    });

    // Assert
    expect(result.current.getChoices("attr-2")).toEqual([]);
    expect(result.current.getChoices("attr-1")).toEqual([]);
  });
});
