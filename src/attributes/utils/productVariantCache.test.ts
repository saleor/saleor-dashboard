import { CachedSearchProduct, ProductVariantCacheManager } from "./productVariantCache";

describe("ProductVariantCacheManager", () => {
  let cacheManager: ProductVariantCacheManager;

  beforeEach(() => {
    cacheManager = new ProductVariantCacheManager();
  });

  it("should cache variant maps per product instance", () => {
    // Arrange
    const variants = [{ id: "variant-1", name: "Variant A" }];
    let accessCount = 0;

    const product = {
      __typename: "Product",
      id: "product-1",
      name: "Product 1",
      productType: {
        __typename: "ProductType",
        id: "type-id",
        name: "Type",
      },
    } as unknown as CachedSearchProduct;

    Object.defineProperty(product, "variants", {
      configurable: true,
      get: () => {
        accessCount += 1;

        return variants as CachedSearchProduct["variants"];
      },
    });

    // Act
    const firstAccess = cacheManager.getProductVariantById(product, "variant-1");

    // Assert
    expect(firstAccess?.name).toBe("Variant A");
    expect(accessCount).toBe(2); // truthy check + iteration

    Object.defineProperty(product, "variants", {
      configurable: true,
      get: () => {
        throw new Error("variants getter should not be called after caching");
      },
    });

    // Act
    const secondAccess = cacheManager.getProductVariantById(product, "variant-1");

    // Assert
    expect(secondAccess?.name).toBe("Variant A");
  });

  it("should rebuild cache when a new product instance is provided", () => {
    // Arrange
    const createProduct = (id: string) =>
      ({
        __typename: "Product",
        id,
        name: `Product ${id}`,
        productType: {
          __typename: "ProductType",
          id: `${id}-type`,
          name: "Type",
        },
        variants: [
          {
            __typename: "ProductVariant",
            id: `${id}-variant-1`,
            name: "Variant 1",
            product: {
              __typename: "Product",
              id,
              name: `Product ${id}`,
              productType: {
                __typename: "ProductType",
                id: `${id}-type`,
                name: "Type",
              },
            },
          },
        ],
      }) as unknown as CachedSearchProduct;

    const firstProduct = createProduct("p1");

    // Act
    const firstResult = cacheManager.getProductVariantById(firstProduct, "p1-variant-1");

    // Assert
    expect(firstResult?.name).toBe("Variant 1");

    const secondProduct = createProduct("p1");

    // Act
    const secondResult = cacheManager.getProductVariantById(secondProduct, "p1-variant-1");

    // Assert
    expect(secondResult?.name).toBe("Variant 1");
  });

  it("should return undefined when variant is missing", () => {
    // Arrange
    const product = {
      __typename: "Product",
      id: "product-1",
      name: "Product 1",
      variants: [],
      productType: {
        __typename: "ProductType",
        id: "type-id",
        name: "Type",
      },
    } as unknown as CachedSearchProduct;

    // Act
    const result = cacheManager.getProductVariantById(product, "missing");

    // Assert
    expect(result).toBeUndefined();
  });

  it("should clear cache when reset is called", () => {
    // Arrange
    const product = {
      __typename: "Product",
      id: "product-1",
      name: "Product 1",
      productType: {
        __typename: "ProductType",
        id: "type-id",
        name: "Type",
      },
      variants: [
        {
          __typename: "ProductVariant",
          id: "variant-1",
          name: "Variant 1",
        },
      ],
    } as unknown as CachedSearchProduct;

    let accessCount = 0;

    Object.defineProperty(product, "variants", {
      configurable: true,
      get: () => {
        accessCount += 1;

        return [
          {
            __typename: "ProductVariant",
            id: "variant-1",
            name: "Variant 1",
          },
        ] as CachedSearchProduct["variants"];
      },
    });

    // Act - First access, should cache
    cacheManager.getProductVariantById(product, "variant-1");
    expect(accessCount).toBe(2); // truthy check + iteration

    // Act - Second access, should use cache
    cacheManager.getProductVariantById(product, "variant-1");
    expect(accessCount).toBe(2); // No additional access

    // Act - Reset cache
    cacheManager.reset();

    // Act - Access after reset, should rebuild cache
    cacheManager.getProductVariantById(product, "variant-1");

    // Assert
    expect(accessCount).toBe(4); // truthy check + iteration again after reset
  });

  it("should provide isolated cache instances", () => {
    // Arrange
    const cache1 = new ProductVariantCacheManager();
    const cache2 = new ProductVariantCacheManager();

    const product = {
      __typename: "Product",
      id: "product-1",
      name: "Product 1",
      productType: {
        __typename: "ProductType",
        id: "type-id",
        name: "Type",
      },
      variants: [
        {
          __typename: "ProductVariant",
          id: "variant-1",
          name: "Variant 1",
        },
      ],
    } as unknown as CachedSearchProduct;

    // Act
    const variant1 = cache1.getProductVariantById(product, "variant-1");

    cache1.reset();

    const variant1AfterReset = cache1.getProductVariantById(product, "variant-1");
    const variant2 = cache2.getProductVariantById(product, "variant-1");

    // Assert
    expect(variant1?.name).toBe("Variant 1");
    expect(variant1AfterReset?.name).toBe("Variant 1");
    expect(variant2?.name).toBe("Variant 1");
  });

  it("should maintain separate caches for different instances", () => {
    // Arrange
    const cache1 = new ProductVariantCacheManager();
    const cache2 = new ProductVariantCacheManager();

    let cache1AccessCount = 0;
    let cache2AccessCount = 0;

    const createProductWithAccessCounter = (accessCountRef: {
      count: number;
    }): CachedSearchProduct => {
      const product = {
        __typename: "Product",
        id: "product-1",
        name: "Product 1",
        productType: {
          __typename: "ProductType",
          id: "type-id",
          name: "Type",
        },
      } as unknown as CachedSearchProduct;

      Object.defineProperty(product, "variants", {
        configurable: true,
        get: () => {
          accessCountRef.count += 1;

          return [
            {
              __typename: "ProductVariant",
              id: "variant-1",
              name: "Variant 1",
            },
          ] as CachedSearchProduct["variants"];
        },
      });

      return product;
    };

    const product1 = createProductWithAccessCounter({ count: 0 });
    const product2 = createProductWithAccessCounter({ count: 0 });

    Object.defineProperty(product1, "variants", {
      configurable: true,
      get: () => {
        cache1AccessCount += 1;

        return [
          {
            __typename: "ProductVariant",
            id: "variant-1",
            name: "Variant 1",
          },
        ] as CachedSearchProduct["variants"];
      },
    });

    Object.defineProperty(product2, "variants", {
      configurable: true,
      get: () => {
        cache2AccessCount += 1;

        return [
          {
            __typename: "ProductVariant",
            id: "variant-1",
            name: "Variant 1",
          },
        ] as CachedSearchProduct["variants"];
      },
    });

    // Act
    cache1.getProductVariantById(product1, "variant-1");
    cache1.getProductVariantById(product1, "variant-1");
    cache2.getProductVariantById(product2, "variant-1");
    cache2.getProductVariantById(product2, "variant-1");

    // Assert
    expect(cache1AccessCount).toBe(2); // truthy check + iteration on first call
    expect(cache2AccessCount).toBe(2); // truthy check + iteration on first call
  });
});
