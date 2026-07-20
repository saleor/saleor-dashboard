import { type SearchProductVariantFragment } from "@dashboard/graphql";
import { type AssignableSearchProduct } from "@dashboard/searches/mapSearchProductsForVariantAssign";

import {
  handleProductAssign,
  handleVariantAssign,
  hasAllVariantsSelected,
  type VariantWithProductLabel,
} from "./utils";

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
  variants: [createVariant("v1"), createVariant("v2"), createVariant("v3")],
  variantsTotalCount: 3,
  variantsHasNextPage: false,
  variantsEndCursor: null,
};

describe("AssignVariantDialog locked variants", () => {
  it("ignores locked variants when toggling a single row", () => {
    // Arrange
    const setVariants = jest.fn();
    const locked = new Set(["v1"]);

    // Act
    handleVariantAssign(
      createVariant("v1"),
      product,
      0,
      0,
      [],
      [[true, false, false]],
      setVariants,
      locked,
    );

    // Assert
    expect(setVariants).not.toHaveBeenCalled();
  });

  it("select-all skips locked variants", () => {
    // Arrange
    const setVariants = jest.fn();
    const locked = new Set(["v1"]);

    // Act
    handleProductAssign(product, 0, [false], [], setVariants, locked);

    // Assert
    const next = setVariants.mock.calls[0][0] as VariantWithProductLabel[];

    expect(next.map(variant => variant.id)).toEqual(["v2", "v3"]);
  });

  it("hasAllVariantsSelected ignores locked rows", () => {
    // Arrange
    const locked = new Set(["v1"]);
    const selected: VariantWithProductLabel[] = [
      { ...createVariant("v2"), productName: "Product 1" },
      { ...createVariant("v3"), productName: "Product 1" },
    ];

    // Act // Assert
    expect(hasAllVariantsSelected(product.variants, selected, locked)).toBe(true);
    expect(hasAllVariantsSelected(product.variants, selected)).toBe(false);
  });
});
