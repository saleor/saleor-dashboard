// @ts-strict-ignore
import { SearchProductsQuery } from "@dashboard/graphql";
import { getById, getByUnmatchingId } from "@dashboard/misc";
import { RelayToFlat } from "@dashboard/types";

type SearchVariant = RelayToFlat<SearchProductsQuery["search"]>[0]["variants"][0];

export interface VariantWithProductLabel extends SearchVariant {
  productName: string;
}

type SetVariantsAction = (data: VariantWithProductLabel[]) => void;

export function isVariantSelected(
  variant: SearchVariant,
  selectedVariantsToProductsMap: SearchVariant[],
): boolean {
  return !!selectedVariantsToProductsMap.find(getById(variant.id));
}

export const handleProductAssign = (
  product: RelayToFlat<SearchProductsQuery["search"]>[0],
  productIndex: number,
  productsWithAllVariantsSelected: boolean[],
  variants: VariantWithProductLabel[],
  setVariants: SetVariantsAction,
) =>
  productsWithAllVariantsSelected[productIndex]
    ? setVariants(
        variants.filter(selectedVariant => !product.variants.find(getById(selectedVariant.id))),
      )
    : setVariants([
        ...variants,
        ...product.variants
          .filter(productVariant => !variants.find(getById(productVariant.id)))
          .map(variant => ({ ...variant, productName: product.name })),
      ]);

export const handleVariantAssign = (
  variant: SearchVariant,
  product: RelayToFlat<SearchProductsQuery["search"]>[0],
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
