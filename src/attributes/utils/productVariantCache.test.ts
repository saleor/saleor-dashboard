import { type CachedSearchProduct, productVariantCacheManager } from "./productVariantCache";

const createProductWithVariants = (
  id: string,
  variants: Array<{ id: string; name: string }>,
): CachedSearchProduct =>
  ({
    __typename: "Product",
    id,
    name: `Product ${id}`,
    productType: {
      __typename: "ProductType",
      id: `${id}-type`,
      name: "Type",
    },
    productVariants: {
      __typename: "ProductVariantCountableConnection",
      totalCount: variants.length,
      edges: variants.map(variant => ({
        __typename: "ProductVariantCountableEdge",
        node: {
          __typename: "ProductVariant",
          id: variant.id,
          name: variant.name,
          sku: null,
          product: {
            __typename: "Product",
            id,
            name: `Product ${id}`,
            thumbnail: null,
            productType: {
              __typename: "ProductType",
              id: `${id}-type`,
              name: "Type",
            },
          },
          channelListings: [],
        },
      })),
    },
  }) as unknown as CachedSearchProduct;

describe("ProductVariantCacheManager", () => {
  beforeEach(() => {
    productVariantCacheManager.resetCache();
  });

  it("should cache variant maps per product instance", () => {
    // Arrange
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

    Object.defineProperty(product, "productVariants", {
      configurable: true,
      get: () => {
        accessCount += 1;

        return {
          __typename: "ProductVariantCountableConnection",
          totalCount: 1,
          edges: [
            {
              __typename: "ProductVariantCountableEdge",
              node: { id: "variant-1", name: "Variant A" },
            },
          ],
        };
      },
    });

    // Act
    const firstAccess = productVariantCacheManager.getProductVariantById(product, "variant-1");

    // Assert
    expect(firstAccess?.name).toBe("Variant A");
    expect(accessCount).toBe(1);

    Object.defineProperty(product, "productVariants", {
      configurable: true,
      get: () => {
        throw new Error("productVariants getter should not be called after caching");
      },
    });

    // Act
    const secondAccess = productVariantCacheManager.getProductVariantById(product, "variant-1");

    // Assert
    expect(secondAccess?.name).toBe("Variant A");
  });

  it("should rebuild cache when a new product instance is provided", () => {
    // Arrange
    const firstProduct = createProductWithVariants("p1", [
      { id: "p1-variant-1", name: "Variant 1" },
    ]);

    // Act
    const firstResult = productVariantCacheManager.getProductVariantById(
      firstProduct,
      "p1-variant-1",
    );

    // Assert
    expect(firstResult?.name).toBe("Variant 1");

    const secondProduct = createProductWithVariants("p1", [
      { id: "p1-variant-1", name: "Variant 1" },
    ]);

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
    const product = createProductWithVariants("product-1", []);

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
    } as unknown as CachedSearchProduct;

    let accessCount = 0;

    Object.defineProperty(product, "productVariants", {
      configurable: true,
      get: () => {
        accessCount += 1;

        return {
          __typename: "ProductVariantCountableConnection",
          totalCount: 1,
          edges: [
            {
              __typename: "ProductVariantCountableEdge",
              node: {
                __typename: "ProductVariant",
                id: "variant-1",
                name: "Variant 1",
              },
            },
          ],
        };
      },
    });

    // Act
    productVariantCacheManager.getProductVariantById(product, "variant-1");
    expect(accessCount).toBe(1);

    productVariantCacheManager.getProductVariantById(product, "variant-1");
    expect(accessCount).toBe(1);

    productVariantCacheManager.resetCache();

    productVariantCacheManager.getProductVariantById(product, "variant-1");

    expect(accessCount).toBe(2);
  });
});
