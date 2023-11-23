import { ConditionType } from "@dashboard/discounts/types";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import { Option } from "@saleor/macaw-ui-next";

import { useCategorieSearch } from "./useCategorieSearch";
import { useCollectionSearch } from "./useCollectionSearch";
import { useProductSearch } from "./useProductSearch";
import { useVariantSearch } from "./useVariantSearch";

export interface FetchOptions {
  fetch: (query: string) => void;
  fetchMoreProps?: ReturnType<typeof getSearchFetchMoreProps>;
  options: Option[];
}

export const useOptionsFetch = () => {
  const productSearch = useProductSearch();
  const collectionSearch = useCollectionSearch();
  const categorySearch = useCategorieSearch();
  const variantSearch = useVariantSearch();

  const typeToFetchMap: Record<ConditionType, FetchOptions> = {
    product: productSearch,
    collection: collectionSearch,
    category: categorySearch,
    variant: variantSearch,
  };

  return (type: ConditionType): FetchOptions => {
    return typeToFetchMap[type];
  };
};
