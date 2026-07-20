import { type SearchProductsQuery, type SearchProductVariantFragment } from "@dashboard/graphql";
import { getById, getByUnmatchingId } from "@dashboard/misc";
import {
  type AssignableSearchProduct,
  isVariantsListTruncated,
  mapSearchProductsForVariantAssign,
} from "@dashboard/searches/mapSearchProductsForVariantAssign";
import { type RelayToFlat } from "@dashboard/types";

export type { AssignableSearchProduct };
export { isVariantsListTruncated };

export type SearchVariant = SearchProductVariantFragment;

export interface VariantWithProductLabel extends SearchVariant {
  productName: string;
}

type SetVariantsAction = (data: VariantWithProductLabel[]) => void;

export const toAssignableProducts = (
  products: RelayToFlat<SearchProductsQuery["search"]> | undefined | null,
): AssignableSearchProduct[] => mapSearchProductsForVariantAssign(products);

export function isVariantSelected(
  variant: SearchVariant,
  selectedVariantsToProductsMap: SearchVariant[],
): boolean {
  return !!selectedVariantsToProductsMap.find(getById(variant.id));
}

export const handleProductAssign = (
  product: AssignableSearchProduct,
  productIndex: number,
  productsWithAllVariantsSelected: boolean[],
  variants: VariantWithProductLabel[],
  setVariants: SetVariantsAction,
  lockedVariantIds: ReadonlySet<string> = new Set(),
) => {
  // Select-all only covers the loaded page; refuse when the catalog is truncated.
  if (isVariantsListTruncated(product)) {
    return;
  }

  const assignableVariants = product.variants.filter(variant => !lockedVariantIds.has(variant.id));

  if (assignableVariants.length === 0) {
    return;
  }

  return productsWithAllVariantsSelected[productIndex]
    ? setVariants(
        variants.filter(selectedVariant => !assignableVariants.find(getById(selectedVariant.id))),
      )
    : setVariants([
        ...variants,
        ...assignableVariants
          .filter(productVariant => !variants.find(getById(productVariant.id)))
          .map(variant => ({ ...variant, productName: product.name })),
      ]);
};

export const handleVariantAssign = (
  variant: SearchVariant,
  product: AssignableSearchProduct,
  variantIndex: number,
  productIndex: number,
  variants: VariantWithProductLabel[],
  selectedVariantsToProductsMap: boolean[][],
  setVariants: SetVariantsAction,
  lockedVariantIds: ReadonlySet<string> = new Set(),
) => {
  if (lockedVariantIds.has(variant.id)) {
    return;
  }

  return selectedVariantsToProductsMap[productIndex][variantIndex]
    ? setVariants(variants.filter(getByUnmatchingId(variant.id)))
    : setVariants([...variants, { ...variant, productName: product.name }]);
};

export function hasAllVariantsSelected(
  productVariants: SearchVariant[],
  selectedVariantsToProductsMap: VariantWithProductLabel[],
  lockedVariantIds: ReadonlySet<string> = new Set(),
): boolean {
  const assignableVariants = productVariants.filter(variant => !lockedVariantIds.has(variant.id));

  if (assignableVariants.length === 0) {
    return false;
  }

  return assignableVariants.every(
    productVariant => !!selectedVariantsToProductsMap.find(getById(productVariant.id)),
  );
}

export const getCompositeLabel = (variant: VariantWithProductLabel) => {
  if (!variant.name) {
    return variant.productName;
  }

  return `${variant.productName}: ${variant.name}`;
};
