import { type ApolloClient } from "@apollo/client";
import { type CategoryFragment } from "@dashboard/graphql";
import { act, renderHook } from "@testing-library/react-hooks";

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
          children: {
            __typename: "CategoryCountableConnection",
            edges: [],
          },
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

  it("should reset expansion state when page size changes", async () => {
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
          children: {
            __typename: "CategoryCountableConnection",
            edges: [{ node: child }],
          },
        },
      };
    });
    clientMock.query.mockResolvedValue({
      data: {
        category: {
          __typename: "Category",
          id: root.id,
          children: {
            __typename: "CategoryCountableConnection",
            edges: [{ node: child }],
          },
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
    act(() => {
      result.current.handleSubcategoryPageSizeChange(100);
    });

    // Assert
    expect(result.current.subcategoryPageSize).toBe(100);
    expect(result.current.hasExpandedSubcategories).toBe(false);
    expect(result.current.isCategoryChildrenLoading(root.id)).toBe(false);
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
          children: {
            __typename: "CategoryCountableConnection",
            edges: [],
          },
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
          first: 50,
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
          children: {
            __typename: "CategoryCountableConnection",
            edges: [{ node: child }],
          },
        },
      };
    });
    clientMock.query.mockResolvedValue({
      data: {
        category: {
          __typename: "Category",
          id: root.id,
          children: {
            __typename: "CategoryCountableConnection",
            edges: [{ node: child }],
          },
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
    const visibleCategoryIds = result.current.visibleRows.map(row => row.category.id);

    // Assert
    expect(visibleCategoryIds).toEqual([root.id, child.id]);
  });
});
