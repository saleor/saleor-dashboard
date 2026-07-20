import { type SearchOrderVariantQuery } from "@dashboard/graphql";
import { type RelayToFlat } from "@dashboard/types";

import {
  isOrderVariantsListTruncated,
  mapSearchOrderVariantsForAdd,
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

describe("mapSearchOrderVariantsForAdd", () => {
  it("flattens productVariants edges into variants and totalCount", () => {
    // Arrange
    const products: SearchProduct[] = [
      createSearchProduct({
        productVariants: {
          __typename: "ProductVariantCountableConnection",
          totalCount: 2,
          edges: [
            {
              __typename: "ProductVariantCountableEdge",
              node: {
                __typename: "ProductVariant",
                id: "v1",
                name: "S",
                sku: "s",
                pricing: null,
              },
            },
            {
              __typename: "ProductVariantCountableEdge",
              node: {
                __typename: "ProductVariant",
                id: "v2",
                name: "M",
                sku: "m",
                pricing: null,
              },
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
        variantsTotalCount: 2,
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
  });

  it("detects truncated variant lists", () => {
    // Arrange // Act // Assert
    expect(
      isOrderVariantsListTruncated({
        variants: [{ id: "v1" } as never],
        variantsTotalCount: 20,
      }),
    ).toBe(true);
    expect(
      isOrderVariantsListTruncated({
        variants: [{ id: "v1" } as never],
        variantsTotalCount: 1,
      }),
    ).toBe(false);
    expect(
      isOrderVariantsListTruncated({
        variants: [],
        variantsTotalCount: null,
      }),
    ).toBe(false);
  });
});
