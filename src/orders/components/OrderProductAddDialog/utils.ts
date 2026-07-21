import {
  isOrderVariantsListTruncated,
  type OrderSearchProduct,
  type OrderSearchVariant,
} from "@dashboard/searches/mapSearchOrderVariantsForAdd";

type SetVariantsAction = (data: OrderSearchVariant[]) => void;

export const hasVariantPricing = (variant: OrderSearchVariant): boolean => !!variant.pricing;

export function hasAllVariantsSelected(
  productVariants: OrderSearchVariant[],
  selectedVariantsToProductsMap: OrderSearchVariant[],
): boolean {
  return productVariants.reduce(
    (acc, productVariant) =>
      acc &&
      !!selectedVariantsToProductsMap.find(
        selectedVariant => selectedVariant.id === productVariant.id,
      ),
    true,
  );
}

export function isVariantSelected(
  variant: OrderSearchVariant,
  selectedVariantsToProductsMap: OrderSearchVariant[],
): boolean {
  return !!selectedVariantsToProductsMap.find(selectedVariant => selectedVariant.id === variant.id);
}

export const onProductAdd = (
  product: OrderSearchProduct,
  productIndex: number,
  productsWithAllVariantsSelected: boolean[],
  variants: OrderSearchVariant[],
  setVariants: SetVariantsAction,
) => {
  if (isOrderVariantsListTruncated(product)) {
    return;
  }

  const productVariants = product.variants.filter(hasVariantPricing);

  return productsWithAllVariantsSelected[productIndex]
    ? setVariants(
        variants.filter(
          selectedVariant =>
            !productVariants.find(productVariant => productVariant.id === selectedVariant.id),
        ),
      )
    : setVariants([
        ...variants,
        ...productVariants.filter(
          productVariant =>
            !variants.find(selectedVariant => selectedVariant.id === productVariant.id),
        ),
      ]);
};

export const onVariantAdd = (
  variant: OrderSearchVariant,
  variantIndex: number,
  productIndex: number,
  variants: OrderSearchVariant[],
  selectedVariantsToProductsMap: boolean[][],
  setVariants: SetVariantsAction,
) =>
  selectedVariantsToProductsMap[productIndex][variantIndex]
    ? setVariants(variants.filter(selectedVariant => selectedVariant.id !== variant.id))
    : setVariants([...variants, variant]);
