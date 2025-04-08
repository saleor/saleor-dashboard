import { SpecificItemsData } from "@dashboard/discounts/components/VoucherCreatePage/hooks/useSpecificItemsAssign";
import { VoucherCreatePageTab } from "@dashboard/discounts/components/VoucherCreatePage/types";
import { renderHook } from "@testing-library/react-hooks";

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
    expect(result.current.paginatedSpecificItems).toEqual([
      { id: "1", name: "category 1" },
      { id: "2", name: "category 2" },
    ]);
    expect(result.current.specificItemsPagination).toEqual(
      expect.objectContaining({
        paginatorType: "click",
        pageInfo: {
          endCursor: "1",
          hasNextPage: true,
          hasPreviousPage: false,
          startCursor: "0",
        },
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
    expect(result.current.paginatedSpecificItems).toEqual([
      { id: "1", name: "collection 1" },
      { id: "2", name: "collection 2" },
    ]);
    expect(result.current.specificItemsPagination).toEqual(
      expect.objectContaining({
        paginatorType: "click",
        pageInfo: {
          endCursor: "1",
          hasNextPage: true,
          hasPreviousPage: false,
          startCursor: "0",
        },
      }),
    );
  });

  it("should paginate categories", () => {
    // Arrange & Act
    const { result } = renderHook(() =>
      useSpecificItemsPagination({
        type: VoucherCreatePageTab.products,
        data,
      }),
    );

    // Assert
    expect(result.current.paginatedSpecificItems).toEqual([
      { id: "1", name: "product 1" },
      { id: "2", name: "product 2" },
    ]);
    expect(result.current.specificItemsPagination).toEqual(
      expect.objectContaining({
        paginatorType: "click",
        pageInfo: {
          endCursor: "1",
          hasNextPage: true,
          hasPreviousPage: false,
          startCursor: "0",
        },
      }),
    );
  });
});
