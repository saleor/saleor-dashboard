import { OrderLineFragment } from "@dashboard/graphql";

import { toLineWithUnfulfilledQuantity } from "./utils";

const line = {
  __typename: "OrderLine",
  id: "id==",
  isShippingRequired: true,
  allocations: [],
  variant: {
    __typename: "ProductVariant",
    id: "variantId==",
    name: "M",
    quantityAvailable: 700,
    preorder: null,
    stocks: [],
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
  totalPrice: {
    __typename: "TaxedMoney",
    net: {
      __typename: "Money",
      amount: 20,
      currency: "PLN",
    },
    gross: {
      __typename: "Money",
      amount: 20,
      currency: "PLN",
    },
  },
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
};

describe("toLineWithUnfulfilledQuantity", () => {
  it("should return lines with quantityToFulfill as quantity", () => {
    // Arrange
    const lines = [line] as OrderLineFragment[];

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
