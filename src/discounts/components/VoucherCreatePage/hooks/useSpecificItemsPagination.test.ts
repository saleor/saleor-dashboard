import { type SpecificItemsData } from "@dashboard/discounts/components/VoucherCreatePage/hooks/useSpecificItemsAssign";
import { VoucherCreatePageTab } from "@dashboard/discounts/components/VoucherCreatePage/types";
import { act, renderHook } from "@testing-library/react";

import { useSpecificItemsPagination } from "./useSpecificItemsPagination";

jest.mock("@dashboard/config", () => ({
  PAGINATE_BY: 2,
}));

describe("VoucherCreatePage / hooks / useSpecificItemsPagination", () => {
  const data = {
    categories: [
      { id: "1", name: "category 1" },
      { id: "2", name: "category 2" },
      { id: "3", name: "category 3" },
    ],
    collections: [
      { id: "1", name: "collection 1" },
      { id: "2", name: "collection 2" },
      { id: "3", name: "collection 3" },
    ],
    products: [
      { id: "1", name: "product 1" },
      { id: "2", name: "product 2" },
      { id: "3", name: "product 3" },
    ],
    variants: [
      { id: "1", name: "variant 1" },
      { id: "2", name: "variant 2" },
      { id: "3", name: "variant 3" },
    ],
  } as unknown as SpecificItemsData;

  it("should paginate categories", () => {
    // Arrange & Act
    const { result } = renderHook(() =>
      useSpecificItemsPagination({
        type: VoucherCreatePageTab.categories,
        data,
      }),
    );

    // Assert
    expect(result.current.paginatedSpecificItems.categories).toEqual([
      { id: "1", name: "category 1" },
      { id: "2", name: "category 2" },
    ]);
    expect(result.current.specificItemsPaginator).toEqual(
      expect.objectContaining({
        paginatorType: "click",
        hasNextPage: true,
        hasPreviousPage: false,
      }),
    );
  });

  it("should paginate collections", () => {
    // Arrange & Act
    const { result } = renderHook(() =>
      useSpecificItemsPagination({
        type: VoucherCreatePageTab.collections,
        data,
      }),
    );

    // Assert
    expect(result.current.paginatedSpecificItems.collections).toEqual([
      { id: "1", name: "collection 1" },
      { id: "2", name: "collection 2" },
    ]);
    expect(result.current.specificItemsPaginator).toEqual(
      expect.objectContaining({
        paginatorType: "click",
        hasNextPage: true,
        hasPreviousPage: false,
      }),
    );
  });

  it("should paginate products", () => {
    // Arrange & Act
    const { result } = renderHook(() =>
      useSpecificItemsPagination({
        type: VoucherCreatePageTab.products,
        data,
      }),
    );

    // Assert
    expect(result.current.paginatedSpecificItems.products).toEqual([
      { id: "1", name: "product 1" },
      { id: "2", name: "product 2" },
    ]);
    expect(result.current.specificItemsPaginator).toEqual(
      expect.objectContaining({
        paginatorType: "click",
        hasNextPage: true,
        hasPreviousPage: false,
      }),
    );
  });

  it("should keep each list to its own items when another tab is active", () => {
    // Arrange & Act
    const { result } = renderHook(() =>
      useSpecificItemsPagination({
        type: VoucherCreatePageTab.categories,
        data,
      }),
    );

    // Assert
    expect(result.current.paginatedSpecificItems.variants).toEqual([
      { id: "1", name: "variant 1" },
      { id: "2", name: "variant 2" },
    ]);
  });

  it("gives PaginatorContext the page flags at its top level", () => {
    // Arrange & Act
    const { result } = renderHook(() =>
      useSpecificItemsPagination({
        type: VoucherCreatePageTab.categories,
        data,
      }),
    );

    // Assert
    expect(result.current.specificItemsPaginator).not.toHaveProperty("pageInfo");
    expect(result.current.specificItemsPaginator.hasNextPage).toBe(true);
  });

  it("goes back a page when unassigning empties the last one", () => {
    // Arrange
    const { result, rerender } = renderHook(
      ({ items }: { items: SpecificItemsData }) =>
        useSpecificItemsPagination({
          type: VoucherCreatePageTab.categories,
          data: items,
        }),
      { initialProps: { items: data } },
    );

    act(() => {
      result.current.specificItemsPaginator.loadNextPage();
    });

    // Act
    rerender({ items: { ...data, categories: data.categories.slice(0, 2) } });

    // Assert
    expect(result.current.pageStart).toBe(0);
    expect(result.current.specificItemsPaginator.hasPreviousPage).toBe(false);
  });

  it("shows the page where newly assigned items start", () => {
    // Arrange
    const { result, rerender } = renderHook(
      ({ items }: { items: SpecificItemsData }) =>
        useSpecificItemsPagination({
          type: VoucherCreatePageTab.categories,
          data: items,
        }),
      { initialProps: { items: data } },
    );
    const assigned = {
      ...data,
      categories: [
        ...data.categories,
        ...data.categories.map(category => ({ ...category, id: `new-${category.id}` })),
      ],
    };

    // Act: the page asks for that page in the same update that adds the items.
    act(() => {
      result.current.showPageWithItemAt(data.categories.length);
      rerender({ items: assigned });
    });

    // Assert
    expect(result.current.pageStart).toBe(2);
    expect(result.current.specificItemsPaginator.hasPreviousPage).toBe(true);
  });
});
