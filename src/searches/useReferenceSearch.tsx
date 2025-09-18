import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { AttributeDetailsFragment, VariantAttributeFragment } from "@dashboard/graphql";
import usePageSearch from "@dashboard/searches/usePageSearch";
import useProductSearch from "@dashboard/searches/useProductSearch";
import { useMemo } from "react";

enum ReferenceType {
  ProductType = "ProductType",
  PageType = "PageType",
}

enum ReferenceWhereKey {
  ProductType = "productType",
  PageType = "pageType",
}

type AttributeWithReferenceTypes =
  | NonNullable<AttributeDetailsFragment>
  | NonNullable<VariantAttributeFragment>;

const getAllowedReferenceTypeIds = (
  refAttr: AttributeWithReferenceTypes | undefined,
  type: ReferenceType,
): string[] => {
  if (refAttr?.referenceTypes?.[0]?.__typename === type) {
    return (refAttr.referenceTypes ?? []).map(t => t?.id);
  }

  return [];
};

const buildReferenceSearchVariables = (
  allowedIds: string[] | undefined,
  whereKey: ReferenceWhereKey,
) => ({
  ...DEFAULT_INITIAL_SEARCH_DATA,
  ...(allowedIds?.length ? { where: { [whereKey]: { oneOf: allowedIds } } } : {}),
});

export const useReferenceProductSearch = (refAttr: AttributeWithReferenceTypes | undefined) => {
  const ids = useMemo(
    () => getAllowedReferenceTypeIds(refAttr, ReferenceType.ProductType),
    [refAttr],
  );
  const variables = useMemo(
    () => buildReferenceSearchVariables(ids, ReferenceWhereKey.ProductType),
    [ids],
  );

  return useProductSearch({ variables });
};

export const useReferencePageSearch = (refAttr: AttributeWithReferenceTypes | undefined) => {
  const ids = useMemo(() => getAllowedReferenceTypeIds(refAttr, ReferenceType.PageType), [refAttr]);
  const variables = useMemo(
    () => buildReferenceSearchVariables(ids, ReferenceWhereKey.PageType),
    [ids],
  );

  return usePageSearch({ variables });
};
