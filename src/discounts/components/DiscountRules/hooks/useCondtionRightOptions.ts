import { CatalogConditions, OrderConditions } from "@dashboard/discounts/types";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import { Option } from "@saleor/macaw-ui-next";
import { useState } from "react";

import { useCategorieOptions } from "./useCategorieOptions";
import { useCollectionOptions } from "./useCollectionOptions";
import { useProductOptions } from "./useProductOptions";
import { useVariantOptions } from "./useVariantOptions";

export interface FetchOptions {
  fetch: (query: string) => void;
  fetchMoreProps?: ReturnType<typeof getSearchFetchMoreProps>;
  options: Option[];
}

export const useCondtionRightOptions = () => {
  const [channel, setChannel] = useState<string | undefined>(undefined);

  const productSearch = useProductOptions(channel);
  const collectionSearch = useCollectionOptions(channel);
  const categorySearch = useCategorieOptions(channel);
  const variantSearch = useVariantOptions(channel);

  const typeToFetchMap: Record<
    CatalogConditions | OrderConditions,
    FetchOptions
  > = {
    product: productSearch,
    collection: collectionSearch,
    category: categorySearch,
    variant: variantSearch,
    subtotal: undefined,
    total: undefined,
  };

  const getFetchProps = (type: CatalogConditions) => {
    return typeToFetchMap[type];
  };

  return {
    getFetchProps,
    setChannel: channel => setChannel(channel),
  };
};
