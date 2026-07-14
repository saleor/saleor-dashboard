import { type PageWhereInput, type ProductWhereInput } from "@dashboard/graphql";

import { type InitialPageConstraints } from "../ModalFilters/entityConfigs/ModalPageFilterProvider";
import { type InitialConstraints } from "../ModalFilters/entityConfigs/ModalProductFilterProvider";

export interface ReferenceWhereConstraints {
  productTypeIds?: string[];
  pageTypeIds?: string[];
}

type ProductWithType = {
  productType?: { id: string } | null;
};

export const getReferenceWhereConstraints = (
  initialConstraints?: (InitialConstraints & InitialPageConstraints) | undefined,
): ReferenceWhereConstraints => ({
  productTypeIds: initialConstraints?.productTypes?.map(type => type.id),
  pageTypeIds: initialConstraints?.pageTypes?.map(type => type.id),
});

export const hasReferenceTypeConstraints = (
  initialConstraints?: (InitialConstraints & InitialPageConstraints) | undefined,
): boolean =>
  Boolean(initialConstraints?.productTypes?.length || initialConstraints?.pageTypes?.length);

/** Ensures reference attribute type restrictions survive modal filter races on open. */
export const mergeProductReferenceWhereConstraints = (
  where: ProductWhereInput | undefined,
  productTypeIds: string[] | undefined,
): ProductWhereInput => {
  if (!productTypeIds?.length) {
    return where ?? {};
  }

  return {
    ...where,
    productType: { oneOf: productTypeIds },
  };
};

/** Ensures reference attribute type restrictions survive modal filter races on open. */
export const mergePageReferenceWhereConstraints = (
  where: PageWhereInput | undefined,
  pageTypeIds: string[] | undefined,
): PageWhereInput => {
  if (!pageTypeIds?.length) {
    return where ?? {};
  }

  return {
    ...where,
    pageType: { oneOf: pageTypeIds },
  };
};

/** Apollo can briefly surface unconstrained `previousData` while a constrained refetch runs. */
export const productsIncludeDisallowedReferenceTypes = <T extends ProductWithType>(
  products: T[] | null | undefined,
  productTypeIds: string[] | undefined,
): boolean => {
  if (!productTypeIds?.length || !products?.length) {
    return false;
  }

  const allowedIds = new Set(productTypeIds);

  return products.some(
    product => !product.productType?.id || !allowedIds.has(product.productType.id),
  );
};

/** Hide stale unconstrained search results until the constrained query settles. */
export const filterProductsByReferenceTypeConstraints = <T extends ProductWithType>(
  products: T[] | null | undefined,
  initialConstraints?: InitialConstraints,
): T[] => {
  const productTypeIds = initialConstraints?.productTypes?.map(type => type.id);

  if (!productTypeIds?.length || !products?.length) {
    return products ?? [];
  }

  const allowedIds = new Set(productTypeIds);

  return products.filter(
    product => product.productType?.id && allowedIds.has(product.productType.id),
  );
};

export const getReferencePickerLoadingState = (
  loading: boolean,
  initialConstraints?: InitialConstraints,
  products?: ProductWithType[] | null,
): boolean =>
  loading ||
  productsIncludeDisallowedReferenceTypes(
    products,
    initialConstraints?.productTypes?.map(type => type.id),
  );
