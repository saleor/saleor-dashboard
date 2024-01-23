import { DiscountValueTypeEnum, OrderLineFragment } from "@dashboard/graphql";
import { FormsetData } from "@dashboard/hooks/useFormset";

import { LineItemData } from "../components/OrderReturnPage/form";
import { getItemPriceAndQuantity } from "./data";

const mockedOrderLines: Array<OrderLineFragment & { orderLineId?: string }> = [
  {
    __typename: "OrderLine",
    id: "RnVsZmlsbG1lbnRMaW5lOjU1Nw==",
    isShippingRequired: true,
    allocations: [
      {
        __typename: "Allocation",
        id: "QWxsb2NhdGlvbjozMDQ2",
        quantity: 0,
        warehouse: {
          __typename: "Warehouse",
          id: "V2FyZWhvdXNlOjdmZDA0OGI0LWYwNzItNDZmMi1iMDMyLTc3ZWU3MDNiMzM3Yg==",
          name: "Americas",
        },
      },
    ],
    variant: {
      __typename: "ProductVariant",
      id: "UHJvZHVjdFZhcmlhbnQ6MjE0",
      name: "500ml",
      quantityAvailable: 50,
      preorder: null,
      stocks: [
        {
          __typename: "Stock",
          id: "U3RvY2s6NTEzMg==",
          quantity: 456,
          quantityAllocated: 0,
          warehouse: {
            __typename: "Warehouse",
            id: "V2FyZWhvdXNlOjlkYjY4NWQxLWViMTktNDU2ZS05ODMyLTMxODA3ZWM0NDdhOQ==",
            name: "Europe",
          },
        },
        {
          __typename: "Stock",
          id: "U3RvY2s6NTEzNA==",
          quantity: 414,
          quantityAllocated: 44,
          warehouse: {
            __typename: "Warehouse",
            id: "V2FyZWhvdXNlOjdmZDA0OGI0LWYwNzItNDZmMi1iMDMyLTc3ZWU3MDNiMzM3Yg==",
            name: "Americas",
          },
        },
      ],
      product: {
        __typename: "Product",
        id: "UHJvZHVjdDo3Ng==",
        isAvailableForPurchase: true,
      },
    },
    productName: "Coconut Juice transaction flow",
    productSku: "3944859",
    quantity: 1,
    quantityFulfilled: 2,
    quantityToFulfill: 0,
    totalPrice: {
      __typename: "TaxedMoney",
      net: {
        __typename: "Money",
        amount: 21,
        currency: "EUR",
      },
      gross: {
        __typename: "Money",
        amount: 21,
        currency: "EUR",
      },
    },
    unitDiscount: {
      __typename: "Money",
      amount: 10.5,
      currency: "EUR",
    },
    unitDiscountValue: 10.5,
    unitDiscountReason:
      "Promotion: UHJvbW90aW9uOjYyNTgyZTZmLWNjYzQtNDMyNC05MmM2LWI3ZDg5ZjFjZWJmMw==",
    unitDiscountType: DiscountValueTypeEnum.FIXED,
    undiscountedUnitPrice: {
      __typename: "TaxedMoney",
      currency: "EUR",
      gross: {
        __typename: "Money",
        amount: 21,
        currency: "EUR",
      },
      net: {
        __typename: "Money",
        amount: 21,
        currency: "EUR",
      },
    },
    unitPrice: {
      __typename: "TaxedMoney",
      gross: {
        __typename: "Money",
        amount: 10.5,
        currency: "EUR",
      },
      net: {
        __typename: "Money",
        amount: 10.5,
        currency: "EUR",
      },
    },
    thumbnail: {
      __typename: "Image",
      url: "",
    },
    orderLineId:
      "T3JkZXJMaW5lOmZjNzRlNDliLWQyNTItNDVhYS1hMWU0LWQ2MGU5MzFiNjNlOA==",
  },
];
const mockedItemQuantities: FormsetData<LineItemData, number> = [
  {
    data: {
      isFulfillment: true,
      isRefunded: false,
      orderLineId:
        "T3JkZXJMaW5lOmZjNzRlNDliLWQyNTItNDVhYS1hMWU0LWQ2MGU5MzFiNjNlOA==",
    },
    id: "RnVsZmlsbG1lbnRMaW5lOjU1Ng==",
    label: "",
    value: 1,
  },
  {
    data: {
      isFulfillment: true,
      isRefunded: false,
      orderLineId:
        "T3JkZXJMaW5lOmZjNzRlNDliLWQyNTItNDVhYS1hMWU0LWQ2MGU5MzFiNjNlOA==",
    },
    id: "RnVsZmlsbG1lbnRMaW5lOjU1Nw==",
    label: "",
    value: 0,
  },
];

describe("getItemPriceAndQuantity", () => {
  it("returns undefined unitPrice when ID is not found", () => {
    // Arrange
    const orderLines = mockedOrderLines;
    const itemsQuantities = mockedItemQuantities;
    const id = "RnVsZmlsbG1lbnRMaW5lOjU1Ng==";
    // Act
    const result = getItemPriceAndQuantity({ orderLines, itemsQuantities, id });
    // Assert
    expect(result).toEqual({
      selectedQuantity: 1,
      unitPrice: undefined,
    });
  });
});
