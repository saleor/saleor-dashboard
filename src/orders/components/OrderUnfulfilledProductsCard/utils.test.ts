import { type OrderLineFragment } from "@dashboard/graphql";

import { toLineWithUnfulfilledQuantity } from "./utils";

const taxedMoneyPln20 = {
  __typename: "TaxedMoney" as const,
  net: {
    __typename: "Money" as const,
    amount: 20,
    currency: "PLN",
  },
  gross: {
    __typename: "Money" as const,
    amount: 20,
    currency: "PLN",
  },
};

const line: OrderLineFragment = {
  __typename: "OrderLine",
  id: "id==",
  isShippingRequired: true,
  allocations: null,
  variant: {
    __typename: "ProductVariant",
    id: "variantId==",
    name: "M",
    quantityAvailable: 700,
    preorder: null,
    stocks: null,
    product: {
      __typename: "Product",
      id: "UHJvZHVjdDoxMTY=",
      isAvailableForPurchase: true,
    },
  },
  productName: "Blue Hoodie 4",
  productSku: "21599567",
  isGift: false,
  quantity: 5,
  quantityFulfilled: 4,
  quantityToFulfill: 1,
  totalPrice: taxedMoneyPln20,
  undiscountedTotalPrice: taxedMoneyPln20,
  unitDiscount: {
    __typename: "Money",
    amount: 0,
    currency: "PLN",
  },
  unitDiscountValue: 0,
  unitDiscountReason: null,
  unitDiscountType: null,
  undiscountedUnitPrice: {
    __typename: "TaxedMoney",
    currency: "PLN",
    gross: {
      __typename: "Money",
      amount: 20,
      currency: "PLN",
    },
    net: {
      __typename: "Money",
      amount: 20,
      currency: "PLN",
    },
  },
  unitPrice: {
    __typename: "TaxedMoney",
    gross: {
      __typename: "Money",
      amount: 20,
      currency: "PLN",
    },
    net: {
      __typename: "Money",
      amount: 20,
      currency: "PLN",
    },
  },
  thumbnail: null,
  discounts: null,
};

describe("toLineWithUnfulfilledQuantity", () => {
  it("should return lines with quantityToFulfill as quantity", () => {
    // Arrange
    const lines: OrderLineFragment[] = [line];

    // Act
    const result = toLineWithUnfulfilledQuantity(lines);

    // Assert
    expect(result).toEqual([
      {
        ...line,
        quantity: line.quantityToFulfill,
      },
    ]);
  });
});
