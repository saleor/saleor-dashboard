// @ts-strict-ignore
import { ProductCountQueryVariables, useProductCountQuery } from "@dashboard/graphql";
import {
  UseTypeDeleteData,
  UseTypeDeleteProps,
} from "@dashboard/pageTypes/hooks/usePageTypeDelete/types";
import { productListUrl } from "@dashboard/products/urls";
import {
  ProductTypeListUrlQueryParams,
  ProductTypeUrlQueryParams,
} from "@dashboard/productTypes/urls";
import React from "react";

import * as messages from "./messages";

type UseProductTypeDeleteProps<T = ProductTypeListUrlQueryParams | ProductTypeUrlQueryParams> =
  UseTypeDeleteProps<T>;

function useProductTypeDelete({
  params,
  singleId,
  selectedTypes,
}: UseProductTypeDeleteProps): UseTypeDeleteData {
  const productTypes = selectedTypes || [singleId];
  const isDeleteDialogOpen = params.action === "remove";
  const productsAssignedToSelectedTypesQueryVars = React.useMemo<ProductCountQueryVariables>(
    () => ({
      filter: {
        productTypes,
      },
    }),
    [productTypes],
  );
  const shouldSkipProductListQuery = !productTypes.length || !isDeleteDialogOpen;
  const {
    data: productsAssignedToSelectedTypesData,
    loading: loadingProductsAssignedToSelectedTypes,
  } = useProductCountQuery({
    variables: productsAssignedToSelectedTypesQueryVars,
    skip: shouldSkipProductListQuery,
  });
  const selectedProductsAssignedToDeleteUrl = productListUrl({
    productTypes,
  });
  const assignedItemsCount = productsAssignedToSelectedTypesData?.products?.totalCount;

  return {
    ...messages,
    isOpen: isDeleteDialogOpen,
    assignedItemsCount,
    viewAssignedItemsUrl: selectedProductsAssignedToDeleteUrl,
    isLoading: loadingProductsAssignedToSelectedTypes,
    typesToDelete: productTypes,
  };
}

export default useProductTypeDelete;
