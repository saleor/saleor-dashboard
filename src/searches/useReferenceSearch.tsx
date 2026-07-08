import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  type AttributeDetailsFragment,
  AttributeEntityTypeEnum,
  type VariantAttributeFragment,
} from "@dashboard/graphql";
import useCategorySearch from "@dashboard/searches/useCategorySearch";
import useCollectionSearch from "@dashboard/searches/useCollectionSearch";
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

/** Skip the search unless the reference dialog is open (refAttr is defined)
 * and the attribute actually references the given entity type. */
const shouldSkipSearch = (
  refAttr: AttributeWithReferenceTypes | undefined,
  entityTypes: AttributeEntityTypeEnum[],
): boolean => !refAttr?.entityType || !entityTypes.includes(refAttr.entityType);

export const useReferenceProductSearch = (refAttr: AttributeWithReferenceTypes | undefined) => {
  const ids = useMemo(
    () => getAllowedReferenceTypeIds(refAttr, ReferenceType.ProductType),
    [refAttr],
  );
  const variables = useMemo(
    () => buildReferenceSearchVariables(ids, ReferenceWhereKey.ProductType),
    [ids],
  );

  return useProductSearch({
    variables,
    skip: shouldSkipSearch(refAttr, [
      AttributeEntityTypeEnum.PRODUCT,
      AttributeEntityTypeEnum.PRODUCT_VARIANT,
    ]),
  });
};

export const useReferencePageSearch = (refAttr: AttributeWithReferenceTypes | undefined) => {
  const ids = useMemo(() => getAllowedReferenceTypeIds(refAttr, ReferenceType.PageType), [refAttr]);
  const variables = useMemo(
    () => buildReferenceSearchVariables(ids, ReferenceWhereKey.PageType),
    [ids],
  );

  return usePageSearch({
    variables,
    skip: shouldSkipSearch(refAttr, [AttributeEntityTypeEnum.PAGE]),
  });
};

export const useReferenceCategorySearch = (refAttr: AttributeWithReferenceTypes | undefined) =>
  useCategorySearch({
    variables: {
      after: DEFAULT_INITIAL_SEARCH_DATA.after,
      first: DEFAULT_INITIAL_SEARCH_DATA.first,
      filter: undefined,
    },
    skip: shouldSkipSearch(refAttr, [AttributeEntityTypeEnum.CATEGORY]),
  });

export const useReferenceCollectionSearch = (refAttr: AttributeWithReferenceTypes | undefined) =>
  useCollectionSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
    skip: shouldSkipSearch(refAttr, [AttributeEntityTypeEnum.COLLECTION]),
  });
