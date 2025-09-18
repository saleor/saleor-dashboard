import {
  CachedSearchProduct,
  getProductVariantById,
  resetProductVariantCache,
} from "./productVariantCache";

describe("productVariantCache", () => {
  beforeEach(() => {
    resetProductVariantCache();
  });

  it("should cache variant maps per product instance", () => {
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

    expect(getProductVariantById(product, "variant-1")?.name).toBe("Variant A");
    expect(accessCount).toBe(2); // truthy check + iteration

    Object.defineProperty(product, "variants", {
      configurable: true,
      get: () => {
        throw new Error("variants getter should not be called after caching");
      },
    });

    expect(getProductVariantById(product, "variant-1")?.name).toBe("Variant A");
  });

  it("should rebuild cache when a new product instance is provided", () => {
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

    expect(getProductVariantById(firstProduct, "p1-variant-1")?.name).toBe("Variant 1");

    const secondProduct = createProduct("p1");

    expect(getProductVariantById(secondProduct, "p1-variant-1")?.name).toBe("Variant 1");
  });

  it("should return undefined when variant is missing", () => {
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

    expect(getProductVariantById(product, "missing")).toBeUndefined();
  });
});
