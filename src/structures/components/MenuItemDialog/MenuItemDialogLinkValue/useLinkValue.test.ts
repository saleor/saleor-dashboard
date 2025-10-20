import useCategorySearch from "@dashboard/searches/useCategorySearch";
import useCollectionSearch from "@dashboard/searches/useCollectionSearch";
import usePageSearch from "@dashboard/searches/usePageSearch";
import { renderHook } from "@testing-library/react-hooks";

import { useLinkValue } from "./useLinkValue";

jest.mock("@dashboard/searches/useCategorySearch");
jest.mock("@dashboard/searches/useCollectionSearch");
jest.mock("@dashboard/searches/usePageSearch");

describe("useLinkValue", () => {
  it("should return categories link value props", () => {
    // Arrange
    (useCategorySearch as jest.Mock).mockReturnValue({
      result: {
        loading: false,
        data: {
          search: {
            edges: [
              {
                node: {
                  id: "1",
                  name: "Category 1",
                },
              },
            ],
          },
        },
      },
      search: jest.fn(),
      loadMore: jest.fn(),
    });

    // Act
    const { result } = renderHook(() => useLinkValue("category"));

    // Assert
    expect(result.current).toEqual({
      options: [
        {
          label: "Category 1",
          value: "1",
        },
      ],
      fetchMoreProps: {
        hasMore: false,
        loading: false,
        onFetchMore: expect.any(Function),
      },
      onQueryChange: expect.any(Function),
      loading: false,
    });
  });

  it("should return collection link value props", () => {
    // Arrange
    (useCollectionSearch as jest.Mock).mockReturnValue({
      result: {
        loading: false,
        data: {
          search: {
            edges: [
              {
                node: {
                  id: "1",
                  name: "Collection 1",
                },
              },
            ],
          },
        },
      },
      search: jest.fn(),
      loadMore: jest.fn(),
    });

    // Act
    const { result } = renderHook(() => useLinkValue("collection"));

    // Assert
    expect(result.current).toEqual({
      options: [
        {
          label: "Collection 1",
          value: "1",
        },
      ],
      fetchMoreProps: {
        hasMore: false,
        loading: false,
        onFetchMore: expect.any(Function),
      },
      onQueryChange: expect.any(Function),
      loading: false,
    });
  });

  it("should return page link value props", () => {
    // Arrange
    (usePageSearch as jest.Mock).mockReturnValue({
      result: {
        loading: false,
        data: {
          search: {
            edges: [
              {
                node: {
                  id: "1",
                  title: "Page 1",
                },
              },
            ],
          },
        },
      },
      search: jest.fn(),
      loadMore: jest.fn(),
    });

    // Act
    const { result } = renderHook(() => useLinkValue("page"));

    // Assert
    expect(result.current).toEqual({
      options: [
        {
          label: "Page 1",
          value: "1",
        },
      ],
      fetchMoreProps: {
        hasMore: false,
        loading: false,
        onFetchMore: expect.any(Function),
      },
      onQueryChange: expect.any(Function),
      loading: false,
    });
  });

  it("should call search function on query change", () => {
    // Arrange
    const searchFn = jest.fn();
    const queryString = "test";

    (usePageSearch as jest.Mock).mockReturnValue({
      result: {
        loading: false,
        data: {
          search: {
            edges: [],
          },
        },
      },
      search: searchFn,
      loadMore: jest.fn(),
    });

    const { result } = renderHook(() => useLinkValue("page"));

    // Act
    result.current.onQueryChange(queryString);

    // Assert
    expect(searchFn).toHaveBeenCalledWith(queryString);
  });

  it("should call on fetch more", () => {
    // Arrange
    const fetchMoreFn = jest.fn();

    (usePageSearch as jest.Mock).mockReturnValue({
      result: {
        loading: false,
        data: {
          search: {
            edges: [],
          },
        },
      },
      search: jest.fn(),
      loadMore: fetchMoreFn,
    });

    const { result } = renderHook(() => useLinkValue("page"));

    // Act
    result.current.fetchMoreProps.onFetchMore();

    // Assert
    expect(fetchMoreFn).toHaveBeenCalled();
  });
});
