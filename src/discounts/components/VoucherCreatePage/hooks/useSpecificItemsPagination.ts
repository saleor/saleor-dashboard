import { PAGINATE_BY } from "@dashboard/config";
import {
  CategoryWithTotalProductsFragment,
  CollectionWithTotalProductsFragment,
  SearchProductFragment,
} from "@dashboard/graphql";
import useLocalPageInfo from "@dashboard/hooks/useLocalPageInfo";

import { VoucherCreatePageTab } from "../types";

export const useSpecificItemsPagination = ({
  type,
  data,
}: {
  type: VoucherCreatePageTab;
  data: {
    categories: CategoryWithTotalProductsFragment[];
    collections: CollectionWithTotalProductsFragment[];
    products: SearchProductFragment[];
  };
}) => {
  const { pageInfo, pageValues, resetPage, loadNextPage, loadPreviousPage } = useLocalPageInfo<
    CategoryWithTotalProductsFragment | CollectionWithTotalProductsFragment | SearchProductFragment
  >(data[type], PAGINATE_BY);

  return {
    paginatedSpecificItems: pageValues,
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
