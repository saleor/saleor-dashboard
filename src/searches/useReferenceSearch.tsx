import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { ProductVariantAttributesFragment } from "@dashboard/graphql";
import usePageSearch from "@dashboard/searches/usePageSearch";
import useProductSearch from "@dashboard/searches/useProductSearch";
import React from "react";

export enum ReferenceType {
  ProductType = "ProductType",
  PageType = "PageType",
}

export enum ReferenceWhereKey {
  ProductType = "productType",
  PageType = "pageType",
}

type AttributeWithReferenceTypes =
  NonNullable<ProductVariantAttributesFragment["attributes"][number]["attribute"]>;

export const getAllowedReferenceTypeIds = (
  refAttr: AttributeWithReferenceTypes | undefined,
  type: ReferenceType,
): string[] => {
  if (refAttr?.referenceTypes?.[0]?.__typename === type) {
    return (refAttr.referenceTypes ?? []).map((t: any) => t?.id).filter(Boolean);
  }

  return [];
};

export const buildReferenceSearchVariables = (
  allowedIds: string[] | undefined,
  whereKey: ReferenceWhereKey,
) => ({
  ...DEFAULT_INITIAL_SEARCH_DATA,
  ...(allowedIds?.length ? { where: { [whereKey]: { oneOf: allowedIds } } } : {}),
});

export const useReferenceProductSearch = (refAttr: AttributeWithReferenceTypes | undefined) => {
  const ids = React.useMemo(
    () => getAllowedReferenceTypeIds(refAttr, ReferenceType.ProductType),
    [refAttr],
  );
  const variables = React.useMemo(
    () => buildReferenceSearchVariables(ids, ReferenceWhereKey.ProductType),
    [ids],
  );

  return useProductSearch({ variables });
};

export const useReferencePageSearch = (refAttr: AttributeWithReferenceTypes | undefined) => {
  const ids = React.useMemo(
    () => getAllowedReferenceTypeIds(refAttr, ReferenceType.PageType),
    [refAttr],
  );
  const variables = React.useMemo(
    () => buildReferenceSearchVariables(ids, ReferenceWhereKey.PageType),
    [ids],
  );

  return usePageSearch({ variables });
};
