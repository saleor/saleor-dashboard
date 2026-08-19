import {
  type OrderSearchProduct,
  type OrderSearchVariant,
} from "@dashboard/searches/mapSearchOrderVariantsForAdd";

import { hasVariantPricing, onProductAdd } from "./utils";

const createVariant = (id: string, withPricing: boolean): OrderSearchVariant => ({
  __typename: "ProductVariant",
  id,
  name: id,
  sku: id,
  pricing: withPricing
    ? {
        __typename: "VariantPricingInfo",
        onSale: false,
        price: {
          __typename: "TaxedMoney",
          gross: { __typename: "Money", amount: 1, currency: "USD" },
        },
        priceUndiscounted: {
          __typename: "TaxedMoney",
          gross: { __typename: "Money", amount: 1, currency: "USD" },
        },
      }
    : null,
});

describe("OrderProductAddDialog utils", () => {
  const product: OrderSearchProduct = {
    __typename: "Product",
    id: "product-1",
    name: "Product 1",
    thumbnail: null,
    variantsTotalCount: 2,
    variantsHasNextPage: false,
    variantsEndCursor: null,
    variants: [createVariant("variant-priced", true), createVariant("variant-unpriced", false)],
  };

  it("adds only priced variants when selecting a product", () => {
    // Arrange
    const setVariants = jest.fn();

    // Act
    onProductAdd(product, 0, [false], [], setVariants);

    // Assert
    expect(setVariants).toHaveBeenCalledWith([expect.objectContaining({ id: "variant-priced" })]);
    expect(setVariants.mock.calls[0][0]).toHaveLength(1);
  });

  it("does not select-all when the variants list is truncated", () => {
    // Arrange
    const setVariants = jest.fn();
    const truncated: OrderSearchProduct = {
      ...product,
      variantsTotalCount: 50,
      variantsHasNextPage: true,
      variantsEndCursor: "cursor-1",
    };

    // Act
    onProductAdd(truncated, 0, [false], [], setVariants);

    // Assert
    expect(setVariants).not.toHaveBeenCalled();
  });

  it("detects variants without channel pricing", () => {
    // Arrange // Act // Assert
    expect(hasVariantPricing(createVariant("variant-priced", true))).toBe(true);
    expect(hasVariantPricing(createVariant("variant-unpriced", false))).toBe(false);
  });
});
