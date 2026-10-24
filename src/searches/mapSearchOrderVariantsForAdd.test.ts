import { type SearchOrderVariantQuery } from "@dashboard/graphql";
import { type RelayToFlat } from "@dashboard/types";

import {
  appendOrderProductVariantsPage,
  applyChannelVariantIds,
  isOrderVariantsListTruncated,
  mapSearchOrderVariantsForAdd,
  type OrderSearchProduct,
  type OrderSearchVariant,
} from "./mapSearchOrderVariantsForAdd";

type SearchProduct = NonNullable<RelayToFlat<SearchOrderVariantQuery["search"]>>[number];

const createSearchProduct = (
  overrides: Partial<SearchProduct> & {
    productVariants: SearchProduct["productVariants"];
  },
): SearchProduct => ({
  __typename: "Product",
  id: "product-1",
  name: "Product 1",
  thumbnail: null,
  ...overrides,
});

const createVariant = (id: string): OrderSearchVariant => ({
  __typename: "ProductVariant",
  id,
  name: id,
  sku: id,
  pricing: null,
});

const baseProduct = (overrides: Partial<OrderSearchProduct> = {}): OrderSearchProduct => ({
  __typename: "Product",
  id: "product-1",
  name: "Product 1",
  thumbnail: null,
  variants: [createVariant("v1"), createVariant("v2")],
  variantsTotalCount: 4,
  variantsHasNextPage: true,
  channelVariantIds: null,
  missingVariantIds: [],
  ...overrides,
});

describe("mapSearchOrderVariantsForAdd", () => {
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
    const mapped = mapSearchOrderVariantsForAdd(products);

    // Assert
    expect(mapped).toEqual([
      expect.objectContaining({
        id: "product-1",
        variantsTotalCount: 40,
        variantsHasNextPage: true,
        channelVariantIds: null,
        missingVariantIds: [],
        variants: [expect.objectContaining({ id: "v1" }), expect.objectContaining({ id: "v2" })],
      }),
    ]);
    expect(mapped[0]).not.toHaveProperty("productVariants");
  });

  it("treats missing productVariants as an empty list", () => {
    // Arrange // Act
    const mapped = mapSearchOrderVariantsForAdd([createSearchProduct({ productVariants: null })]);

    // Assert
    expect(mapped[0].variants).toEqual([]);
    expect(mapped[0].variantsTotalCount).toBeNull();
    expect(mapped[0].variantsHasNextPage).toBe(false);
    expect(mapped[0].channelVariantIds).toBeNull();
    expect(mapped[0].missingVariantIds).toEqual([]);
  });

  it("treats the list as truncated from pageInfo until channel ids are known", () => {
    // Arrange // Act // Assert
    expect(
      isOrderVariantsListTruncated({
        channelVariantIds: null,
        missingVariantIds: [],
        variantsHasNextPage: true,
      }),
    ).toBe(true);
    expect(
      isOrderVariantsListTruncated({
        channelVariantIds: null,
        missingVariantIds: [],
        variantsHasNextPage: false,
      }),
    ).toBe(false);
    expect(
      isOrderVariantsListTruncated({
        channelVariantIds: ["v1", "v2"],
        missingVariantIds: ["v2"],
        variantsHasNextPage: false,
      }),
    ).toBe(true);
    expect(
      isOrderVariantsListTruncated({
        channelVariantIds: ["v1"],
        missingVariantIds: [],
        variantsHasNextPage: true,
      }),
    ).toBe(false);
  });

  it("keeps only channel-listed variants and records the ones still missing", () => {
    // Arrange
    const product = baseProduct({
      variants: [createVariant("v1"), createVariant("off-channel"), createVariant("v3")],
    });

    // Act
    const next = applyChannelVariantIds(product, ["v3", "v1", "v2"]);

    // Assert
    expect(next.variants.map(variant => variant.id)).toEqual(["v3", "v1"]);
    expect(next.channelVariantIds).toEqual(["v3", "v1", "v2"]);
    expect(next.missingVariantIds).toEqual(["v2"]);
  });

  it("appends fetched variants in channel order without duplicates", () => {
    // Arrange
    const product = applyChannelVariantIds(baseProduct(), ["v2", "v1", "v3", "v4"]);

    // Act
    const next = appendOrderProductVariantsPage(product, {
      variants: [createVariant("v1"), createVariant("v3"), createVariant("v4")],
      requestedIds: ["v3", "v4"],
    });

    // Assert
    expect(next.variants.map(variant => variant.id)).toEqual(["v2", "v1", "v3", "v4"]);
    expect(next.missingVariantIds).toEqual([]);
    expect(next.channelVariantIds).toEqual(["v2", "v1", "v3", "v4"]);
  });

  it("stops treating requested ids as missing when the API does not return them", () => {
    // Arrange
    const product = applyChannelVariantIds(baseProduct({ variants: [] }), ["v1", "v2", "v3"]);

    // Act
    const next = appendOrderProductVariantsPage(product, {
      variants: [createVariant("v1")],
      requestedIds: ["v1", "v2"],
    });

    // Assert
    expect(next.variants.map(variant => variant.id)).toEqual(["v1"]);
    expect(next.missingVariantIds).toEqual(["v3"]);
    expect(isOrderVariantsListTruncated(next)).toBe(true);
  });
});
