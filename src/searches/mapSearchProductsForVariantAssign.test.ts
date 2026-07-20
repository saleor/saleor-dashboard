import { type SearchProductsQuery, type SearchProductVariantFragment } from "@dashboard/graphql";
import { type RelayToFlat } from "@dashboard/types";

import {
  appendSearchProductVariantsPage,
  type AssignableSearchProduct,
  isVariantsListTruncated,
  mapSearchProductsForVariantAssign,
} from "./mapSearchProductsForVariantAssign";

type SearchProduct = NonNullable<RelayToFlat<SearchProductsQuery["search"]>>[number];

const createVariant = (id: string): SearchProductVariantFragment => ({
  __typename: "ProductVariant",
  id,
  name: id,
  sku: id,
  product: {
    __typename: "Product",
    id: "product-1",
    name: "Product 1",
    thumbnail: null,
    productType: {
      __typename: "ProductType",
      id: "type-1",
      name: "Type",
    },
  },
  channelListings: [],
});

const createSearchProduct = (
  overrides: Partial<SearchProduct> & {
    productVariants: SearchProduct["productVariants"];
  },
): SearchProduct => {
  const { channelListings = [], collections = [], productVariants, ...rest } = overrides;
  const product: SearchProduct = {
    __typename: "Product",
    id: "product-1",
    name: "Product 1",
    thumbnail: null,
    productType: {
      __typename: "ProductType",
      id: "type-1",
      name: "Type",
    },
    channelListings,
    collections,
    productVariants,
    ...rest,
  };

  return product;
};

describe("mapSearchProductsForVariantAssign", () => {
  it("flattens productVariants edges into variants and page info", () => {
    // Arrange
    const products: SearchProduct[] = [
      createSearchProduct({
        productVariants: {
          __typename: "ProductVariantCountableConnection",
          totalCount: 40,
          pageInfo: {
            __typename: "PageInfo",
            hasNextPage: true,
            endCursor: "cursor-1",
          },
          edges: [
            {
              __typename: "ProductVariantCountableEdge",
              node: createVariant("v1"),
            },
            {
              __typename: "ProductVariantCountableEdge",
              node: createVariant("v2"),
            },
          ],
        },
      }),
    ];

    // Act
    const mapped = mapSearchProductsForVariantAssign(products);

    // Assert
    expect(mapped).toEqual([
      expect.objectContaining({
        id: "product-1",
        variantsTotalCount: 40,
        variantsHasNextPage: true,
        variantsEndCursor: "cursor-1",
        variants: [expect.objectContaining({ id: "v1" }), expect.objectContaining({ id: "v2" })],
      }),
    ]);
    expect(mapped[0]).not.toHaveProperty("productVariants");
  });

  it("treats missing productVariants as an empty list", () => {
    // Arrange // Act
    const mapped = mapSearchProductsForVariantAssign([
      createSearchProduct({ productVariants: null }),
    ]);

    // Assert
    expect(mapped[0].variants).toEqual([]);
    expect(mapped[0].variantsTotalCount).toBeNull();
    expect(mapped[0].variantsHasNextPage).toBe(false);
    expect(mapped[0].variantsEndCursor).toBeNull();
  });

  it("detects truncated variant lists from pageInfo only", () => {
    // Arrange // Act // Assert
    expect(
      isVariantsListTruncated({
        variantsHasNextPage: true,
      }),
    ).toBe(true);
    expect(
      isVariantsListTruncated({
        variantsHasNextPage: false,
      }),
    ).toBe(false);
    // Filtered-away assigned variants must not look truncated when hasNextPage is false
    expect(
      isVariantsListTruncated({
        variantsHasNextPage: false,
      }),
    ).toBe(false);
  });

  it("does not treat totalCount skew as hasNextPage without a cursor", () => {
    // Arrange
    const products = [
      createSearchProduct({
        productVariants: {
          __typename: "ProductVariantCountableConnection",
          totalCount: 10,
          pageInfo: {
            __typename: "PageInfo",
            hasNextPage: false,
            endCursor: null,
          },
          edges: [
            {
              __typename: "ProductVariantCountableEdge",
              node: createVariant("v1"),
            },
          ],
        },
      }),
    ];

    // Act
    const mapped = mapSearchProductsForVariantAssign(products);

    // Assert
    expect(mapped[0].variantsHasNextPage).toBe(false);
    expect(isVariantsListTruncated(mapped[0])).toBe(false);
  });

  it("appends the next variants page without duplicates", () => {
    // Arrange
    const product: AssignableSearchProduct = {
      __typename: "Product",
      id: "product-1",
      name: "Product 1",
      thumbnail: null,
      productType: {
        __typename: "ProductType",
        id: "type-1",
        name: "Type",
      },
      channelListings: [],
      collections: [],
      variants: [createVariant("v1"), createVariant("v2")],
      variantsTotalCount: 4,
      variantsHasNextPage: true,
      variantsEndCursor: "cursor-1",
    };

    // Act
    const next = appendSearchProductVariantsPage(product, {
      variants: [createVariant("v2"), createVariant("v3"), createVariant("v4")],
      totalCount: 4,
      hasNextPage: false,
      endCursor: "cursor-2",
    });

    // Assert
    expect(next.variants.map(variant => variant.id)).toEqual(["v1", "v2", "v3", "v4"]);
    expect(next.variantsHasNextPage).toBe(false);
    expect(next.variantsEndCursor).toBe("cursor-2");
    expect(next.variantsTotalCount).toBe(4);
  });
});
