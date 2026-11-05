import { PAGINATE_BY } from "@dashboard/config";
import useLocalPageInfo from "@dashboard/hooks/useLocalPageInfo";

import { type VoucherCreatePageTab } from "../types";
import { type SpecificItemsData } from "./useSpecificItemsAssign";

export const useSpecificItemsPagination = ({
  type,
  data,
  paginateBy = PAGINATE_BY,
}: {
  type: VoucherCreatePageTab;
  data: Omit<SpecificItemsData, "countries">;
  paginateBy?: number;
}) => {
  const { pageInfo, resetPage, loadNextPage, loadPreviousPage } = useLocalPageInfo<unknown>(
    data[type],
    paginateBy,
  );
  // Page bounds come from the active tab; only its panel renders, so slicing the others is harmless.
  const slicePage = <T>(items: T[]): T[] =>
    items.slice(pageInfo.startCursor, pageInfo.endCursor + 1);

  return {
    paginatedSpecificItems: {
      categories: slicePage(data.categories),
      collections: slicePage(data.collections),
      products: slicePage(data.products),
      variants: slicePage(data.variants),
    },
    resetSpecificItemsPagination: resetPage,
    specificItemsPagination: {
      loadNextPage,
      loadPreviousPage,
      paginatorType: "click",
      pageInfo: {
        ...pageInfo,
        endCursor: pageInfo.endCursor.toString(),
        startCursor: pageInfo.startCursor.toString(),
      },
    },
  };
};
