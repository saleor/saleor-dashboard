import { CachedSearchProduct, productVariantCacheManager } from "./productVariantCache";

describe("ProductVariantCacheManager", () => {
  beforeEach(() => {
    productVariantCacheManager.resetCache();
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
    const firstAccess = productVariantCacheManager.getProductVariantById(product, "variant-1");

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
    const secondAccess = productVariantCacheManager.getProductVariantById(product, "variant-1");

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
    const firstResult = productVariantCacheManager.getProductVariantById(
      firstProduct,
      "p1-variant-1",
    );

    // Assert
    expect(firstResult?.name).toBe("Variant 1");

    const secondProduct = createProduct("p1");

    // Act
    const secondResult = productVariantCacheManager.getProductVariantById(
      secondProduct,
      "p1-variant-1",
    );

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
    const result = productVariantCacheManager.getProductVariantById(product, "missing");

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

    // Act
    // First access, should cache
    productVariantCacheManager.getProductVariantById(product, "variant-1");
    expect(accessCount).toBe(2); // truthy check + iteration

    // Second access, should use cache
    productVariantCacheManager.getProductVariantById(product, "variant-1");
    expect(accessCount).toBe(2); // No additional access

    // Reset cache
    productVariantCacheManager.resetCache();

    // Access after reset, should rebuild cache
    productVariantCacheManager.getProductVariantById(product, "variant-1");

    expect(accessCount).toBe(4); // truthy check + iteration again after reset
  });
});
