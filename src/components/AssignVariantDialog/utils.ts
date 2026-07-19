import { type SearchProductsQuery, type SearchProductVariantFragment } from "@dashboard/graphql";
import { getById, getByUnmatchingId } from "@dashboard/misc";
import {
  type AssignableSearchProduct,
  mapSearchProductsForVariantAssign,
} from "@dashboard/searches/mapSearchProductsForVariantAssign";
import { type RelayToFlat } from "@dashboard/types";

export type { AssignableSearchProduct };

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

export const isVariantsListTruncated = (
  product: Pick<AssignableSearchProduct, "variants" | "variantsTotalCount">,
): boolean =>
  product.variantsTotalCount !== null && product.variants.length < product.variantsTotalCount;

export const handleProductAssign = (
  product: AssignableSearchProduct,
  productIndex: number,
  productsWithAllVariantsSelected: boolean[],
  variants: VariantWithProductLabel[],
  setVariants: SetVariantsAction,
) => {
  // Select-all only covers the loaded page; refuse when the catalog is truncated.
  if (isVariantsListTruncated(product)) {
    return;
  }

  return productsWithAllVariantsSelected[productIndex]
    ? setVariants(
        variants.filter(selectedVariant => !product.variants.find(getById(selectedVariant.id))),
      )
    : setVariants([
        ...variants,
        ...product.variants
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
) =>
  selectedVariantsToProductsMap[productIndex][variantIndex]
    ? setVariants(variants.filter(getByUnmatchingId(variant.id)))
    : setVariants([...variants, { ...variant, productName: product.name }]);

export function hasAllVariantsSelected(
  productVariants: SearchVariant[],
  selectedVariantsToProductsMap: VariantWithProductLabel[],
): boolean {
  return productVariants.reduce(
    (acc, productVariant) =>
      acc && !!selectedVariantsToProductsMap.find(getById(productVariant.id)),
    true,
  );
}

export const getCompositeLabel = (variant: VariantWithProductLabel) => {
  if (!variant.name) {
    return variant.productName;
  }

  return `${variant.productName}: ${variant.name}`;
};
