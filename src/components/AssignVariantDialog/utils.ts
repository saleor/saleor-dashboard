import { formatVariantReferenceLabel } from "@dashboard/attributes/utils/formatVariantReferenceLabel";
import { type SearchProductsQuery, type SearchProductVariantFragment } from "@dashboard/graphql";
import { getById, getByUnmatchingId } from "@dashboard/misc";
import {
  type AssignableSearchProduct,
  isVariantsListTruncated,
  mapSearchProductsForVariantAssign,
} from "@dashboard/searches/mapSearchProductsForVariantAssign";
import { type Container, type RelayToFlat } from "@dashboard/types";

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

export const getCompositeLabel = (variant: VariantWithProductLabel): string =>
  formatVariantReferenceLabel(variant.productName || variant.product?.name || "", variant.name);

/**
 * Submit payload for the assign dialog. `name` is the "Product: Variant" label most callers show
 * and must win over `...variant.name`; `variantName` keeps the variant's own name.
 */
export const toAssignedVariantContainers = (
  variants: VariantWithProductLabel[],
): Array<VariantWithProductLabel & { name: string; variantName: string }> =>
  variants.map(variant => ({
    ...variant,
    id: variant.id,
    name: getCompositeLabel(variant),
    variantName: variant.name,
  }));

/**
 * The submitted variants with their own names, for lists that show the product and the variant
 * in separate columns. Items without a `variantName` are kept as they are.
 */
export const withVariantOwnNames = <T extends Container>(containers: T[]): T[] =>
  containers.map(container =>
    "variantName" in container && typeof container.variantName === "string"
      ? { ...container, name: container.variantName }
      : container,
  );
