import { type TypeBaseData } from "@dashboard/components/TypeDeleteWarningDialog/types";
import { useViewProducts } from "@dashboard/components/TypeDeleteWarningDialog/useViewProducts";
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
import { resolveProductTypesForViewLink } from "./resolveProductTypesForViewLink";

type UseProductTypeDeleteProps<T = ProductTypeListUrlQueryParams | ProductTypeUrlQueryParams> =
  UseTypeDeleteProps<T> & { typeBaseData: ProductTypeBaseData[] | undefined };

interface ProductTypeBaseData extends TypeBaseData {
  slug?: string | null;
}

function useProductTypeDelete({
  params,
  singleId,
  selectedTypes,
  typeBaseData,
}: UseProductTypeDeleteProps): UseTypeDeleteData {
  const productTypes = useMemo(() => {
    if (selectedTypes?.length) {
      return selectedTypes.filter((type): type is string => !!type);
    }

    return singleId ? [singleId] : [];
  }, [selectedTypes, singleId]);

  const isDeleteDialogOpen = params.action === "remove";
  const productsAssignedToSelectedTypesQueryVars = useMemo<ProductCountQueryVariables>(
    () =>
      productTypes.length
        ? {
            filter: {
              productTypes,
            },
          }
        : {},
    [productTypes],
  );
  const shouldSkipProductListQuery = !productTypes.length || !isDeleteDialogOpen;
  const { data: productsAssignedToSelectedTypesData } = useProductCountQuery({
    variables: productsAssignedToSelectedTypesQueryVars,
    skip: shouldSkipProductListQuery,
  });

  const typesToLink = useMemo(
    () => resolveProductTypesForViewLink(productTypes, typeBaseData),
    [productTypes, typeBaseData],
  );

  const viewProductsURL = useViewProducts({
    productTypeBaseData: typesToLink,
  });

  const assignedItemsCount = productsAssignedToSelectedTypesData?.products?.totalCount;

  return {
    ...messages,
    isOpen: isDeleteDialogOpen,
    assignedItemsCount: assignedItemsCount ?? undefined,
    viewAssignedItemsUrl: viewProductsURL,
    typesToDelete: productTypes,
  };
}

export default useProductTypeDelete;
