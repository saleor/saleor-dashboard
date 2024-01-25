import { CatalogConditions } from "@dashboard/discounts/types";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import { Option } from "@saleor/macaw-ui-next";

import { useCategorieOptions } from "./API/useCategorieOptions";
import { useCollectionOptions } from "./API/useCollectionOptions";
import { useProductOptions } from "./API/useProductOptions";
import { useVariantOptions } from "./API/useVariantOptions";

export interface FetchOptions {
  fetch: (query: string) => void;
  fetchMoreProps?: ReturnType<typeof getSearchFetchMoreProps>;
  options: Option[];
}

export const useCondtionValuesOptions = (channel: string | null) => {
  const productSearch = useProductOptions(channel);
  const collectionSearch = useCollectionOptions(channel);
  const categorySearch = useCategorieOptions(channel);
  const variantSearch = useVariantOptions(channel);

  const typeToFetchMap: Record<CatalogConditions, FetchOptions> = {
    product: productSearch,
    collection: collectionSearch,
    category: categorySearch,
    variant: variantSearch,
  };

  const getConditionValuesFetchProps = (
    type: string,
  ): FetchOptions | undefined => {
    return typeToFetchMap[type as CatalogConditions];
  };

  return {
    getConditionValuesFetchProps,
  };
};
