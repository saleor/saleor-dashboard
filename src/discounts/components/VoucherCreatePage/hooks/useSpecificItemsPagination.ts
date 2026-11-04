import { PAGINATE_BY } from "@dashboard/config";
import {
  type CategoryWithTotalProductsFragment,
  type CollectionWithTotalProductsFragment,
  type SearchProductFragment,
  type SearchProductVariantFragment,
} from "@dashboard/graphql";
import useLocalPageInfo from "@dashboard/hooks/useLocalPageInfo";

import { type VoucherCreatePageTab } from "../types";

type ProductVariant = SearchProductVariantFragment;

export const useSpecificItemsPagination = ({
  type,
  data,
  paginateBy = PAGINATE_BY,
}: {
  type: VoucherCreatePageTab;
  data: {
    categories: CategoryWithTotalProductsFragment[];
    collections: CollectionWithTotalProductsFragment[];
    products: SearchProductFragment[];
    variants: ProductVariant[];
  };
  paginateBy?: number;
}) => {
  const { pageInfo, resetPage, loadNextPage, loadPreviousPage } = useLocalPageInfo<
    | CategoryWithTotalProductsFragment
    | CollectionWithTotalProductsFragment
    | SearchProductFragment
    | ProductVariant
  >(data[type], paginateBy);

  return {
    // `slice` bounds of the current page; callers cut their own typed list with them.
    pageRange: { start: pageInfo.startCursor, end: pageInfo.endCursor + 1 },
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
