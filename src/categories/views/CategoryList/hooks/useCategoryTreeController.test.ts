import { type ApolloClient } from "@apollo/client";
import { SUBCATEGORIES_PAGE_SIZE } from "@dashboard/categories/views/CategoryList/services/categoryChildrenQueries";
import { type CategoryFragment } from "@dashboard/graphql";
import { act, renderHook } from "@testing-library/react";

import { useCategoryTreeController } from "./useCategoryTreeController";

const flushPromises = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 0));
};

const createCategory = (id: string, childrenCount = 0): CategoryFragment =>
  ({
    __typename: "Category",
    id,
    name: id,
    children: {
      __typename: "CategoryCountableConnection",
      totalCount: childrenCount,
    },
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 0,
    },
  }) as CategoryFragment;

interface ApolloClientMock {
  readQuery: jest.Mock;
  query: jest.Mock;
}

const createApolloClientMock = (): ApolloClientMock => ({
  readQuery: jest.fn(),
  query: jest.fn(),
});

const createChildrenConnection = (children: CategoryFragment[], hasNextPage = false) => ({
  __typename: "CategoryCountableConnection",
  edges: children.map(child => ({ node: child })),
  pageInfo: {
    __typename: "PageInfo",
    hasNextPage,
    endCursor: hasNextPage ? "cursor-1" : null,
    hasPreviousPage: false,
    startCursor: null,
  },
});

describe("useCategoryTreeController", () => {
  it("should restore expanded ids only once", async () => {
    // Arrange
    const root = createCategory("root", 1);
    const clientMock = createApolloClientMock();

    clientMock.readQuery.mockImplementation(() => {
      throw new Error("cache miss");
    });
    clientMock.query.mockResolvedValue({
      data: {
        category: {
          __typename: "Category",
          id: root.id,
          children: createChildrenConnection([]),
        },
      },
    });

    const props = {
      client: clientMock as unknown as ApolloClient<object>,
      categories: [root],
      locationPathname: "/categories/",
      clearRowSelection: jest.fn(),
      storedExpandedIds: [root.id],
      setStoredExpandedIds: jest.fn(),
    };

    const { rerender } = renderHook(args => useCategoryTreeController(args), {
      initialProps: props,
    });

    // Act
    await act(async () => {
      await flushPromises();
    });

    rerender(props);

    await act(async () => {
      await flushPromises();
    });

    // Assert
    expect(clientMock.query).toHaveBeenCalledTimes(1);
  });

  it("should toggle category expansion with loading lifecycle", async () => {
    // Arrange
    const root = createCategory("root", 1);
    const clientMock = createApolloClientMock();

    clientMock.readQuery.mockImplementation(() => {
      throw new Error("cache miss");
    });
    clientMock.query.mockResolvedValue({
      data: {
        category: {
          __typename: "Category",
          id: root.id,
          children: createChildrenConnection([]),
        },
      },
    });

    const { result } = renderHook(() =>
      useCategoryTreeController({
        client: clientMock as unknown as ApolloClient<object>,
        categories: [root],
        locationPathname: "/categories/",
        clearRowSelection: jest.fn(),
        storedExpandedIds: [],
        setStoredExpandedIds: jest.fn(),
      }),
    );

    // Act
    await act(async () => {
      await result.current.toggleExpanded(root.id);
    });

    // Assert
    expect(result.current.isCategoryExpanded(root.id)).toBe(true);
    expect(result.current.isCategoryChildrenLoading(root.id)).toBe(false);
    expect(clientMock.query).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          id: root.id,
          first: SUBCATEGORIES_PAGE_SIZE,
          after: null,
        },
      }),
    );
  });

  it("should build visible rows from cache for expanded categories", async () => {
    // Arrange
    const root = createCategory("root", 1);
    const child = createCategory("child");
    const clientMock = createApolloClientMock();

    clientMock.readQuery.mockImplementation(({ variables }: { variables: { id: string } }) => {
      if (variables.id !== root.id) {
        throw new Error("cache miss");
      }

      return {
        category: {
          __typename: "Category",
          id: root.id,
          children: createChildrenConnection([child]),
        },
      };
    });
    clientMock.query.mockResolvedValue({
      data: {
        category: {
          __typename: "Category",
          id: root.id,
          children: createChildrenConnection([child]),
        },
      },
    });

    const { result } = renderHook(() =>
      useCategoryTreeController({
        client: clientMock as unknown as ApolloClient<object>,
        categories: [root],
        locationPathname: "/categories/",
        clearRowSelection: jest.fn(),
        storedExpandedIds: [root.id],
        setStoredExpandedIds: jest.fn(),
      }),
    );

    await act(async () => {
      await flushPromises();
    });

    // Act
    const visibleCategoryIds = result.current.visibleRows
      .filter(row => row.type === "category")
      .map(row => row.category.id);

    // Assert
    expect(visibleCategoryIds).toEqual([root.id, child.id]);
  });

  it("should append load more row when additional children are available", async () => {
    // Arrange
    const root = createCategory("root", 120);
    const firstPageChildren = Array.from({ length: SUBCATEGORIES_PAGE_SIZE }, (_, index) =>
      createCategory(`child-${index}`),
    );
    const clientMock = createApolloClientMock();

    clientMock.readQuery.mockImplementation(() => {
      throw new Error("cache miss");
    });
    clientMock.query.mockResolvedValue({
      data: {
        category: {
          __typename: "Category",
          id: root.id,
          children: createChildrenConnection(firstPageChildren, true),
        },
      },
    });

    const { result } = renderHook(() =>
      useCategoryTreeController({
        client: clientMock as unknown as ApolloClient<object>,
        categories: [root],
        locationPathname: "/categories/",
        clearRowSelection: jest.fn(),
        storedExpandedIds: [],
        setStoredExpandedIds: jest.fn(),
      }),
    );

    await act(async () => {
      await result.current.toggleExpanded(root.id);
    });

    // Act
    const lastRow = result.current.visibleRows.at(-1);

    // Assert
    expect(lastRow).toMatchObject({
      type: "load-more",
      parentId: root.id,
      remainingCount: 70,
    });
  });

  it("should load additional children when load more is triggered", async () => {
    // Arrange
    const root = createCategory("root", 80);
    const firstPageChildren = Array.from({ length: SUBCATEGORIES_PAGE_SIZE }, (_, index) =>
      createCategory(`child-${index}`),
    );
    const secondPageChildren = [createCategory("child-50"), createCategory("child-51")];
    const clientMock = createApolloClientMock();

    clientMock.readQuery.mockImplementation(() => {
      throw new Error("cache miss");
    });
    clientMock.query
      .mockResolvedValueOnce({
        data: {
          category: {
            __typename: "Category",
            id: root.id,
            children: createChildrenConnection(firstPageChildren, true),
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          category: {
            __typename: "Category",
            id: root.id,
            children: createChildrenConnection(secondPageChildren, false),
          },
        },
      });

    const { result } = renderHook(() =>
      useCategoryTreeController({
        client: clientMock as unknown as ApolloClient<object>,
        categories: [root],
        locationPathname: "/categories/",
        clearRowSelection: jest.fn(),
        storedExpandedIds: [],
        setStoredExpandedIds: jest.fn(),
      }),
    );

    await act(async () => {
      await result.current.toggleExpanded(root.id);
    });

    // Act
    await act(async () => {
      await result.current.loadMoreSubcategories(root.id);
    });

    // Assert
    expect(clientMock.query).toHaveBeenLastCalledWith(
      expect.objectContaining({
        variables: {
          id: root.id,
          first: SUBCATEGORIES_PAGE_SIZE,
          after: "cursor-1",
        },
      }),
    );
    expect(result.current.getCachedChildrenByParentId(root.id)).toHaveLength(52);
    expect(result.current.visibleRows.at(-1)).toMatchObject({
      type: "category",
      category: { id: "child-51" },
    });
  });

  it("should distinguish initial expand loading from load-more loading", async () => {
    // Arrange
    const root = createCategory("root", 80);
    const firstPageChildren = Array.from({ length: SUBCATEGORIES_PAGE_SIZE }, (_, index) =>
      createCategory(`child-${index}`),
    );
    const clientMock = createApolloClientMock();
    let resolveSecondPage: (value: unknown) => void;

    clientMock.readQuery.mockImplementation(() => {
      throw new Error("cache miss");
    });
    clientMock.query
      .mockResolvedValueOnce({
        data: {
          category: {
            __typename: "Category",
            id: root.id,
            children: createChildrenConnection(firstPageChildren, true),
          },
        },
      })
      .mockImplementationOnce(
        () =>
          new Promise(resolve => {
            resolveSecondPage = resolve;
          }),
      );

    const { result } = renderHook(() =>
      useCategoryTreeController({
        client: clientMock as unknown as ApolloClient<object>,
        categories: [root],
        locationPathname: "/categories/",
        clearRowSelection: jest.fn(),
        storedExpandedIds: [],
        setStoredExpandedIds: jest.fn(),
      }),
    );

    await act(async () => {
      await result.current.toggleExpanded(root.id);
    });

    // Act
    let loadMorePromise: Promise<void> | undefined;

    act(() => {
      loadMorePromise = result.current.loadMoreSubcategories(root.id);
    });

    // Assert
    expect(result.current.isCategoryChildrenLoading(root.id)).toBe(false);
    expect(result.current.isLoadingMoreSubcategories(root.id)).toBe(true);

    await act(async () => {
      resolveSecondPage!({
        data: {
          category: {
            __typename: "Category",
            id: root.id,
            children: createChildrenConnection([createCategory("child-50")], false),
          },
        },
      });
      await loadMorePromise;
    });

    expect(result.current.isLoadingMoreSubcategories(root.id)).toBe(false);
  });
});
