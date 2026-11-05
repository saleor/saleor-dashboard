import { PAGINATE_BY } from "@dashboard/config";
import useLocalPageInfo from "@dashboard/hooks/useLocalPageInfo";
import { type ClickPaginatorContextValues } from "@dashboard/hooks/usePaginator";

import { type VoucherCreatePageTab } from "../types";
import { type SpecificItemsData } from "./useSpecificItemsAssign";

type SpecificItemLists = Omit<SpecificItemsData, "countries">;

interface SpecificItemsPagination {
  /** The current page of each list; only the open tab's list is shown. */
  paginatedSpecificItems: SpecificItemLists;
  /** Index of the first item on the current page; changes whenever the page does. */
  pageStart: number;
  resetSpecificItemsPagination: () => void;
  /** Goes to the page that shows the item at `index` of the open list. */
  showPageWithItemAt: (index: number) => void;
  /** Ready for `PaginatorContext`, which reads the page flags at its top level. */
  specificItemsPaginator: ClickPaginatorContextValues;
}

export const useSpecificItemsPagination = ({
  type,
  data,
  paginateBy = PAGINATE_BY,
}: {
  type: VoucherCreatePageTab;
  data: SpecificItemLists;
  paginateBy?: number;
}): SpecificItemsPagination => {
  const { pageInfo, resetPage, loadNextPage, loadPreviousPage, loadPage } =
    useLocalPageInfo<unknown>(data[type], paginateBy, { clampToLastPage: true });
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
    pageStart: pageInfo.startCursor,
    resetSpecificItemsPagination: resetPage,
    // Newly assigned items may not be in `data` until the next render; if `index` is past the end
    // by then, `clampToLastPage` settles on the last page.
    showPageWithItemAt: index => loadPage(Math.floor(index / paginateBy)),
    specificItemsPaginator: {
      paginatorType: "click",
      hasNextPage: pageInfo.hasNextPage,
      hasPreviousPage: pageInfo.hasPreviousPage,
      loadNextPage,
      loadPreviousPage,
    },
  };
};
