import { SearchOrderVariantQuery } from "@saleor/graphql";

type SetVariantsAction = (
  data: SearchOrderVariantQuery["search"]["edges"][0]["node"]["variants"],
) => void;

export function hasAllVariantsSelected(
  productVariants: SearchOrderVariantQuery["search"]["edges"][0]["node"]["variants"],
  selectedVariantsToProductsMap: SearchOrderVariantQuery["search"]["edges"][0]["node"]["variants"],
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
  variant: SearchOrderVariantQuery["search"]["edges"][0]["node"]["variants"][0],
  selectedVariantsToProductsMap: SearchOrderVariantQuery["search"]["edges"][0]["node"]["variants"],
): boolean {
  return !!selectedVariantsToProductsMap.find(
    selectedVariant => selectedVariant.id === variant.id,
  );
}

export const onProductAdd = (
  product: SearchOrderVariantQuery["search"]["edges"][0]["node"],
  productIndex: number,
  productsWithAllVariantsSelected: boolean[],
  variants: SearchOrderVariantQuery["search"]["edges"][0]["node"]["variants"],
  setVariants: SetVariantsAction,
) =>
  productsWithAllVariantsSelected[productIndex]
    ? setVariants(
        variants.filter(
          selectedVariant =>
            !product.variants.find(
              productVariant => productVariant.id === selectedVariant.id,
            ),
        ),
      )
    : setVariants([
        ...variants,
        ...product.variants.filter(
          productVariant =>
            !variants.find(
              selectedVariant => selectedVariant.id === productVariant.id,
            ),
        ),
      ]);

export const onVariantAdd = (
  variant: SearchOrderVariantQuery["search"]["edges"][0]["node"]["variants"][0],
  variantIndex: number,
  productIndex: number,
  variants: SearchOrderVariantQuery["search"]["edges"][0]["node"]["variants"],
  selectedVariantsToProductsMap: boolean[][],
  setVariants: SetVariantsAction,
) =>
  selectedVariantsToProductsMap[productIndex][variantIndex]
    ? setVariants(
        variants.filter(selectedVariant => selectedVariant.id !== variant.id),
      )
    : setVariants([...variants, variant]);
