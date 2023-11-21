import { ConditionType } from "@dashboard/discounts/types";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import { Option } from "@saleor/macaw-ui-next";

import { useCategorieSearch } from "./useCategorieSearch";
import { useCollectionSearch } from "./useCollectionSearch";
import { useProductSearch } from "./useProductSearch";

export interface FetchOptions {
  fetch: (query: string) => void;
  fetchMoreProps?: ReturnType<typeof getSearchFetchMoreProps>;
  options: Option[];
}

export const useOptionsFetch = () => {
  const productSearch = useProductSearch();
  const collectionSearch = useCollectionSearch();
  const categorySearch = useCategorieSearch();

  const typeToFetchMap: Record<ConditionType, FetchOptions> = {
    product: productSearch,
    collection: collectionSearch,
    categorie: categorySearch,
    variant: {} as any, // TODO: implement variant search
  };

  return (type: ConditionType): FetchOptions => {
    return typeToFetchMap[type];
  };
};
