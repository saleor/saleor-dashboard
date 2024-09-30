import { TypeBaseData } from "@dashboard/components/TypeDeleteWarningDialog/types";
import { useViewProducts } from "@dashboard/components/TypeDeleteWarningDialog/useViewProducts";
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
import { useMemo } from "react";

import * as messages from "./messages";

type UseProductTypeDeleteProps<T = ProductTypeListUrlQueryParams | ProductTypeUrlQueryParams> =
  UseTypeDeleteProps<T> & { typeBaseData: TypeBaseData[] | undefined };

function useProductTypeDelete({
  params,
  singleId,
  selectedTypes,
  typeBaseData,
}: UseProductTypeDeleteProps): UseTypeDeleteData {
  const productTypes = useMemo(() => selectedTypes || [singleId], [selectedTypes, singleId]);

  const filteredTypes = productTypes.filter((type): type is string => !!type);

  const isDeleteDialogOpen = params.action === "remove";
  const productsAssignedToSelectedTypesQueryVars = useMemo<ProductCountQueryVariables>(
    () =>
      filteredTypes
        ? {
            filter: {
              productTypes: filteredTypes,
            },
          }
        : {},
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
    productTypes: filteredTypes,
  });

  const typesToLink = Array.isArray(typeBaseData)
    ? typeBaseData.filter((type: TypeBaseData) => productTypes.includes(type.id))
    : undefined;

  const viewProductsURL = useViewProducts({
    defaultNavigationLink: selectedProductsAssignedToDeleteUrl,
    productTypeBaseData: typesToLink,
  });

  const assignedItemsCount = productsAssignedToSelectedTypesData?.products?.totalCount;

  return {
    ...messages,
    isOpen: isDeleteDialogOpen,
    assignedItemsCount: typeof assignedItemsCount === "number" ? assignedItemsCount : undefined,
    viewAssignedItemsUrl: viewProductsURL,
    isLoading: loadingProductsAssignedToSelectedTypes,
    typesToDelete: filteredTypes,
  };
}

export default useProductTypeDelete;
