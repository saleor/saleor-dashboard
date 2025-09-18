import { SearchProductsQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

export type CachedSearchProduct = RelayToFlat<NonNullable<SearchProductsQuery["search"]>>[0];
export type CachedSearchProductVariant = NonNullable<CachedSearchProduct["variants"]>[0];

let productVariantMapCache = new WeakMap<
  CachedSearchProduct,
  Map<string, CachedSearchProductVariant>
>();

const buildVariantMap = (product: CachedSearchProduct) => {
  const variantMap = new Map<string, CachedSearchProductVariant>();

  if (product.variants) {
    for (const variant of product.variants) {
      variantMap.set(variant.id, variant);
    }
  }

  productVariantMapCache.set(product, variantMap);

  return variantMap;
};

export const getProductVariantMap = (product: CachedSearchProduct) => {
  const cached = productVariantMapCache.get(product);

  if (cached) {
    return cached;
  }

  return buildVariantMap(product);
};

export const getProductVariantById = (product: CachedSearchProduct, variantId: string) =>
  getProductVariantMap(product).get(variantId);

export const resetProductVariantCache = () => {
  productVariantMapCache = new WeakMap();
};
