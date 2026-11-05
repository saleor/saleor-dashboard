import { type SearchProductVariantFragment } from "@dashboard/graphql";
import { type AssignableSearchProduct } from "@dashboard/searches/mapSearchProductsForVariantAssign";
import { type Container } from "@dashboard/types";

import {
  getCompositeLabel,
  handleProductAssign,
  handleVariantAssign,
  hasAllVariantsSelected,
  toAssignedVariantContainers,
  type VariantWithProductLabel,
  withVariantOwnNames,
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
  category: null,
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

describe("getCompositeLabel", () => {
  it("joins product and variant names the same way saved values do", () => {
    // Arrange
    const variant: VariantWithProductLabel = {
      ...createVariant("700ml"),
      name: "700ml",
      productName: "Bottle",
    };

    // Act // Assert
    expect(getCompositeLabel(variant)).toBe("Bottle: 700ml");
  });

  it("falls back to nested product.name when productName is missing", () => {
    // Arrange
    const variant: VariantWithProductLabel = {
      ...createVariant("S"),
      name: "S",
      productName: "",
    };

    // Act // Assert
    expect(getCompositeLabel(variant)).toBe("Product 1: S");
  });
});

describe("toAssignedVariantContainers", () => {
  it("does not let variant.name overwrite the composite label", () => {
    // Arrange
    const variant: VariantWithProductLabel = {
      ...createVariant("Default"),
      name: "Default",
      productName: "White Plimsolls",
    };

    // Act
    const [container] = toAssignedVariantContainers([variant]);

    // Assert
    expect(container.name).toBe("White Plimsolls: Default");
    expect(container.variantName).toBe("Default");
    expect(container.id).toBe("Default");
  });
});

describe("withVariantOwnNames", () => {
  it("puts the variant's own name back for lists with a separate product column", () => {
    // Arrange
    const variant: VariantWithProductLabel = {
      ...createVariant("variant-1"),
      name: "Size M",
      productName: "Monospace Tee",
    };
    const assigned = toAssignedVariantContainers([variant]);

    // Act
    const [listed] = withVariantOwnNames(assigned);

    // Assert
    expect(listed.name).toBe("Size M");
    expect(listed.id).toBe("variant-1");
  });

  it("keeps items without a variant name as they are", () => {
    // Arrange
    const container: Container = { id: "variant-2", name: "Monospace Tee: Size L" };

    // Act
    const [listed] = withVariantOwnNames([container]);

    // Assert
    expect(listed).toEqual(container);
  });
});
