import { AttributeEntityTypeEnum } from "@dashboard/graphql";

import usePageTypeSearch from "./usePageTypeSearch";
import useProductTypeSearch from "./useProductTypeSearch";


export default function useReferenceTypeSearch(
  entityType: AttributeEntityTypeEnum | null | undefined,
  options?: Parameters<typeof useProductTypeSearch | typeof usePageTypeSearch>[0],
): ReturnType<typeof useProductTypeSearch | typeof usePageTypeSearch> {
  const productSearch = useProductTypeSearch(options);
  const pageSearch = usePageTypeSearch(options);

  if (entityType === AttributeEntityTypeEnum.PAGE) {
    return pageSearch;
  }

  return productSearch;
}