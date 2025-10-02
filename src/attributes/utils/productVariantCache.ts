import { SearchProductsQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

export type CachedSearchProduct = RelayToFlat<NonNullable<SearchProductsQuery["search"]>>[0];
type CachedSearchProductVariant = NonNullable<CachedSearchProduct["variants"]>[0];

/** Cache available variants in product in order to build fast labels based on selected values in the form */
export class ProductVariantCacheManagerSingleton {
  private static instance: ProductVariantCacheManagerSingleton;

  private cache: WeakMap<CachedSearchProduct, Map<string, CachedSearchProductVariant>>;

  private constructor() {
    this.cache = new WeakMap();
  }

  public static getInstance(): ProductVariantCacheManagerSingleton {
    if (!ProductVariantCacheManagerSingleton.instance) {
      ProductVariantCacheManagerSingleton.instance = new ProductVariantCacheManagerSingleton();
    }

    return ProductVariantCacheManagerSingleton.instance;
  }

  private buildVariantMap(product: CachedSearchProduct): Map<string, CachedSearchProductVariant> {
    const variantMap = new Map<string, CachedSearchProductVariant>();

    if (product.variants) {
      for (const variant of product.variants) {
        variantMap.set(variant.id, variant);
      }
    }

    this.cache.set(product, variantMap);

    return variantMap;
  }

  getProductVariantMap(product: CachedSearchProduct): Map<string, CachedSearchProductVariant> {
    const cached = this.cache.get(product);

    if (cached) {
      return cached;
    }

    return this.buildVariantMap(product);
  }

  getProductVariantById(
    product: CachedSearchProduct,
    variantId: string,
  ): CachedSearchProductVariant | undefined {
    return this.getProductVariantMap(product).get(variantId);
  }

  resetCache(): void {
    this.cache = new WeakMap();
  }
}

export const productVariantCacheManager = ProductVariantCacheManagerSingleton.getInstance();
