import {
  UseTypeDeleteData,
  UseTypeDeleteProps
} from "@saleor/pageTypes/hooks/usePageTypeDelete/types";
import { useProductCountQuery } from "@saleor/products/queries";
import { ProductCountVariables } from "@saleor/products/types/ProductCount";
import { productListUrl } from "@saleor/products/urls";
import {
  ProductTypeListUrlQueryParams,
  ProductTypeUrlQueryParams
} from "@saleor/productTypes/urls";
import React from "react";

import * as messages from "./messages";

type UseProductTypeDeleteProps<
  T = ProductTypeListUrlQueryParams | ProductTypeUrlQueryParams
> = UseTypeDeleteProps<T>;

function useProductTypeDelete({
  params,
  singleId,
  selectedTypes
}: UseProductTypeDeleteProps): UseTypeDeleteData {
  const productTypes = selectedTypes || [singleId];

  const isDeleteDialogOpen = params.action === "remove";

  const productsAssignedToSelectedTypesQueryVars = React.useMemo<
    ProductCountVariables
  >(
    () => ({
      filter: {
        productTypes
      }
    }),
    [productTypes]
  );

  const shouldSkipProductListQuery =
    !productTypes.length || !isDeleteDialogOpen;

  const {
    data: productsAssignedToSelectedTypesData,
    loading: loadingProductsAssignedToSelectedTypes
  } = useProductCountQuery({
    variables: productsAssignedToSelectedTypesQueryVars,
    skip: shouldSkipProductListQuery
  });

  const selectedProductsAssignedToDeleteUrl = productListUrl({
    productTypes
  });

  const assignedItemsCount =
    productsAssignedToSelectedTypesData?.products?.totalCount;

  return {
    ...messages,
    isOpen: isDeleteDialogOpen,
    assignedItemsCount,
    viewAssignedItemsUrl: selectedProductsAssignedToDeleteUrl,
    isLoading: loadingProductsAssignedToSelectedTypes,
    typesToDelete: productTypes
  };
}

export default useProductTypeDelete;
