import { SearchProductsQuery } from "@dashboard/graphql";
import { getById, getByUnmatchingId } from "@dashboard/misc";
import { RelayToFlat } from "@dashboard/types";

type SearchProducts = NonNullable<RelayToFlat<SearchProductsQuery["search"]>>;
type SearchProduct = SearchProducts[number];
type SearchVariantList = NonNullable<SearchProduct["variants"]>;
type SearchVariant = SearchVariantList[number];

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
  product: SearchProduct,
  productIndex: number,
  productsWithAllVariantsSelected: boolean[],
  variants: VariantWithProductLabel[],
  setVariants: SetVariantsAction,
) => {
  const productVariants = product.variants ?? [];

  return productsWithAllVariantsSelected[productIndex]
    ? setVariants(
        variants.filter(selectedVariant => !productVariants.find(getById(selectedVariant.id))),
      )
    : setVariants([
        ...variants,
        ...productVariants
          .filter((productVariant: SearchVariant) => !variants.find(getById(productVariant.id)))
          .map((variant: SearchVariant) => ({ ...variant, productName: product.name })),
      ]);
};

export const handleVariantAssign = (
  variant: SearchVariant,
  product: SearchProduct,
  variantIndex: number,
  productIndex: number,
  variants: VariantWithProductLabel[],
  selectedVariantsToProductsMap: boolean[][],
  setVariants: SetVariantsAction,
) => {
  const isSelected = selectedVariantsToProductsMap[productIndex]?.[variantIndex] ?? false;

  return isSelected
    ? setVariants(variants.filter(getByUnmatchingId(variant.id)))
    : setVariants([...variants, { ...variant, productName: product.name }]);
};

export function hasAllVariantsSelected(
  productVariants: SearchVariant[] | null | undefined,
  selectedVariantsToProductsMap: VariantWithProductLabel[],
): boolean {
  if (!productVariants || productVariants.length === 0) {
    return false;
  }

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
