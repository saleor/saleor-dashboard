import { type TypeBaseData } from "@dashboard/components/TypeDeleteWarningDialog/types";
import {
  type ProductTypeBaseData,
  useViewProducts,
} from "@dashboard/components/TypeDeleteWarningDialog/useViewProducts";
import { type ProductCountQueryVariables, useProductCountQuery } from "@dashboard/graphql";
import {
  type UseTypeDeleteData,
  type UseTypeDeleteProps,
} from "@dashboard/modelTypes/hooks/usePageTypeDelete/types";
import {
  type ProductTypeListUrlQueryParams,
  type ProductTypeUrlQueryParams,
} from "@dashboard/productTypes/urls";
import { useMemo } from "react";

import * as messages from "./messages";

type UseProductTypeDeleteProps<T = ProductTypeListUrlQueryParams | ProductTypeUrlQueryParams> =
  UseTypeDeleteProps<T> & { typeBaseData: ProductTypeBaseData[] | undefined };

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
      filteredTypes.length
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

  const typesToLink = Array.isArray(typeBaseData)
    ? typeBaseData.filter((type: TypeBaseData) => productTypes.includes(type.id))
    : undefined;

  const viewProductsURL = useViewProducts({
    productTypeBaseData: typesToLink,
  });

  const assignedItemsCount = productsAssignedToSelectedTypesData?.products?.totalCount;

  return {
    ...messages,
    isOpen: isDeleteDialogOpen,
    assignedItemsCount: assignedItemsCount ?? undefined,
    viewAssignedItemsUrl: viewProductsURL,
    isLoading: loadingProductsAssignedToSelectedTypes,
    typesToDelete: filteredTypes,
  };
}

export default useProductTypeDelete;
