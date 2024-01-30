import { CatalogConditions } from "@dashboard/discounts/types";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import { Option } from "@saleor/macaw-ui-next";

import { useCategorieOptions } from "./options/useCategorieOptions";
import { useCollectionOptions } from "./options/useCollectionOptions";
import { useProductOptions } from "./options/useProductOptions";
import { useVariantOptions } from "./options/useVariantOptions";

export interface FetchOptions {
  fetch: (query: string) => void;
  fetchMoreProps?: ReturnType<typeof getSearchFetchMoreProps>;
  options: Option[];
}

export const useCondtionValues = (
  channel: string | null,
  conditionId: string | null,
) => {
  const productSearch = useProductOptions(channel, conditionId);
  const collectionSearch = useCollectionOptions(channel, conditionId);
  const categorySearch = useCategorieOptions(channel, conditionId);
  const variantSearch = useVariantOptions(channel, conditionId);

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
