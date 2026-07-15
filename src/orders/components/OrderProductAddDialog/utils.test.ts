import { type SearchOrderVariantQuery } from "@dashboard/graphql";

import { hasVariantPricing, onProductAdd } from "./utils";

type OrderProduct = NonNullable<SearchOrderVariantQuery["search"]>["edges"][number]["node"];
type OrderVariant = NonNullable<OrderProduct["variants"]>[number];

const createVariant = (id: string, withPricing: boolean): OrderVariant =>
  ({
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
  }) as OrderVariant;

describe("OrderProductAddDialog utils", () => {
  const product: OrderProduct = {
    __typename: "Product",
    id: "product-1",
    name: "Product 1",
    thumbnail: null,
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

  it("detects variants without channel pricing", () => {
    // Arrange // Act // Assert
    expect(hasVariantPricing(createVariant("variant-priced", true))).toBe(true);
    expect(hasVariantPricing(createVariant("variant-unpriced", false))).toBe(false);
  });
});
