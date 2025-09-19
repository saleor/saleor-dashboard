import { SearchProductsQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

export type CachedSearchProduct = RelayToFlat<NonNullable<SearchProductsQuery["search"]>>[0];
export type CachedSearchProductVariant = NonNullable<CachedSearchProduct["variants"]>[0];

export class ProductVariantCacheManager {
  private cache: WeakMap<CachedSearchProduct, Map<string, CachedSearchProductVariant>>;

  constructor() {
    this.cache = new WeakMap();
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

  reset(): void {
    this.cache = new WeakMap();
  }
}
