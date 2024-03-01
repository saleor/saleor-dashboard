// @ts-strict-ignore
import {
  FulfillmentStatus,
  OrderDetailsFragment,
  OrderDetailsWithMetadataFragment,
  OrderDiscountFragment,
  OrderDiscountType,
  OrderLineWithMetadataFragment,
  OrderRefundDataQuery,
  OrderStatus,
  PaymentChargeStatusEnum,
} from "@dashboard/graphql";
import { FormsetData } from "@dashboard/hooks/useFormset";
import { intlMock } from "@test/intl";

import { LineItemData } from "../components/OrderReturnPage/form";
import { OrderRefundSharedType } from "../types";
import {
  getAllFulfillmentLinesPriceSum,
  getDiscountTypeLabel,
  getPreviouslyRefundedPrice,
  getRefundedLinesPriceSum,
  getReplacedProductsAmount,
  getReturnSelectedProductsAmount,
  getWarehousesFromOrderLines,
  mergeRepeatedOrderLines,
  OrderLineWithStockWarehouses,
  OrderWithTotalAndTotalCaptured,
} from "./data";

const orderBase: OrderDetailsFragment = {
  __typename: "Order",
  actions: [],
  shippingMethods: [],
  canFinalize: true,
  channel: null,
  billingAddress: {
    __typename: "Address",
    city: "Port Danielshire",
    cityArea: "",
    companyName: "",
    country: {
      __typename: "CountryDisplay",
      code: "SE",
      country: "Szwecja",
    },
    countryArea: "",
    firstName: "Elizabeth",
    id: "QWRkcmVzczoy",
    lastName: "Vaughn",
    phone: "",
    postalCode: "52203",
    streetAddress1: "419 Ruiz Orchard Apt. 199",
    streetAddress2: "",
  },
  created: "2018-09-11T09:37:30.124154+00:00",
  id: "T3JkZXI6MTk=",
  number: "19",
  paymentStatus: PaymentChargeStatusEnum.FULLY_CHARGED,
  status: OrderStatus.FULFILLED,
  // @ts-expect-error
  total: {
    __typename: "TaxedMoney",
    gross: {
      __typename: "Money",
      amount: 1215.89,
      currency: "USD",
    },
  },
};

describe("Get warehouses used in order", () => {
  it("is able to calculate number of used warehouses from order", () => {
    const lines: OrderLineWithStockWarehouses[] = [
      {
        variant: {
          stocks: [
            {
              warehouse: {
                __typename: "Warehouse",
                id: "warehouse-1",
                name: "Warehouse 1",
              },
            },
            {
              warehouse: {
                __typename: "Warehouse",
                id: "warehouse-2",
                name: "Warehouse 2",
              },
            },
          ],
        },
      },
      {
        variant: {
          stocks: [
            {
              warehouse: {
                __typename: "Warehouse",
                id: "warehouse-1",
                name: "Warehouse 1",
              },
            },
            {
              warehouse: {
                __typename: "Warehouse",
                id: "warehouse-2",
                name: "Warehouse 2",
              },
            },
          ],
        },
      },
      {
        variant: {
          stocks: [
            {
              warehouse: {
                __typename: "Warehouse",
                id: "warehouse-2",
                name: "Warehouse 2",
              },
            },
            {
              warehouse: {
                __typename: "Warehouse",
                id: "warehouse-3",
                name: "Warehouse 3",
              },
            },
          ],
        },
      },
    ];

    const orderWarehouses = getWarehousesFromOrderLines(lines);

    expect(orderWarehouses.length).toBe(3);
  });
});

describe("Get previously refunded price", () => {
  it("is able to calculate refunded price from order", () => {
    const order: OrderWithTotalAndTotalCaptured = {
      total: {
        __typename: "TaxedMoney",
        gross: {
          __typename: "Money",
          amount: 160,
          currency: "USD",
        },
      },
      totalCaptured: {
        __typename: "Money",
        amount: 100,
        currency: "USD",
      },
    };

    const refundedPrice = getPreviouslyRefundedPrice(
      order as unknown as OrderRefundSharedType,
    );

    expect(refundedPrice.amount).toBe(-60);
  });
});

describe("Get refunded lines price sum", () => {
  const lines: OrderRefundDataQuery["order"]["lines"] = [
    {
      __typename: "OrderLine",
      id: "1",
      productName: "Milk 1",
      quantity: 1,
      quantityToFulfill: 0,
      thumbnail: undefined,
      unitPrice: {
        __typename: "TaxedMoney",
        gross: {
          __typename: "Money",
          amount: 10,
          currency: "USD",
        },
      },
    },
    {
      __typename: "OrderLine",
      id: "2",
      productName: "Milk 2",
      quantity: 2,
      quantityToFulfill: 0,
      thumbnail: undefined,
      unitPrice: {
        __typename: "TaxedMoney",
        gross: {
          __typename: "Money",
          amount: 6,
          currency: "USD",
        },
      },
    },
    {
      __typename: "OrderLine",
      id: "3",
      productName: "Milk 3",
      quantity: 4,
      quantityToFulfill: 0,
      thumbnail: undefined,
      unitPrice: {
        __typename: "TaxedMoney",
        gross: {
          __typename: "Money",
          amount: 4,
          currency: "USD",
        },
      },
    },
  ];

  it("is able to sum lines prices", () => {
    const refundedProductQuantities: FormsetData<null, string> = [
      {
        data: null,
        id: "1",
        label: null,
        value: "1",
      },
      {
        data: null,
        id: "2",
        label: null,
        value: "1",
      },
      {
        data: null,
        id: "3",
        label: null,
        value: "1",
      },
    ];

    const refundedLinesPriceSum = getRefundedLinesPriceSum(
      lines,
      refundedProductQuantities,
    );

    expect(refundedLinesPriceSum).toBe(20);
  });

  it("is able to sum lines prices multiplied by different quantities", () => {
    const refundedProductQuantities: FormsetData<null, string> = [
      {
        data: null,
        id: "1",
        label: null,
        value: "0",
      },
      {
        data: null,
        id: "2",
        label: null,
        value: "2",
      },
      {
        data: null,
        id: "3",
        label: null,
        value: "4",
      },
    ];

    const refundedLinesPriceSum = getRefundedLinesPriceSum(
      lines,
      refundedProductQuantities,
    );

    expect(refundedLinesPriceSum).toBe(28);
  });
});

describe("Get get all fulfillment lines price sum", () => {
  const fulfillments: OrderRefundDataQuery["order"]["fulfillments"] = [
    {
      __typename: "Fulfillment",
      fulfillmentOrder: 1,
      id: "1",
      lines: [
        {
          __typename: "FulfillmentLine",
          id: "1-fulfillment-1",
          orderLine: {
            __typename: "OrderLine",
            id: "1-line-1",
            productName: "Milk 1",
            quantity: 1,
            thumbnail: undefined,
            unitPrice: {
              __typename: "TaxedMoney",
              gross: {
                __typename: "Money",
                amount: 10,
                currency: "USD",
              },
            },
          },
          quantity: 1,
        },
      ],
      status: FulfillmentStatus.FULFILLED,
    },
    {
      __typename: "Fulfillment",
      fulfillmentOrder: 2,
      id: "2",
      lines: [
        {
          __typename: "FulfillmentLine",
          id: "2-fulfillment-1",
          orderLine: {
            __typename: "OrderLine",
            id: "2-line-1",
            productName: "Milk 1",
            quantity: 2,
            thumbnail: undefined,
            unitPrice: {
              __typename: "TaxedMoney",
              gross: {
                __typename: "Money",
                amount: 6,
                currency: "USD",
              },
            },
          },
          quantity: 1,
        },
        {
          __typename: "FulfillmentLine",
          id: "2-fulfillment-2",
          orderLine: {
            __typename: "OrderLine",
            id: "2-line-2",
            productName: "Milk 2",
            quantity: 2,
            thumbnail: undefined,
            unitPrice: {
              __typename: "TaxedMoney",
              gross: {
                __typename: "Money",
                amount: 6,
                currency: "USD",
              },
            },
          },
          quantity: 1,
        },
      ],
      status: FulfillmentStatus.FULFILLED,
    },
    {
      __typename: "Fulfillment",
      fulfillmentOrder: 1,
      id: "3",
      lines: [
        {
          __typename: "FulfillmentLine",
          id: "3-fulfillment-1",
          orderLine: {
            __typename: "OrderLine",
            id: "3-line-1",
            productName: "Milk 1",
            quantity: 4,
            thumbnail: undefined,
            unitPrice: {
              __typename: "TaxedMoney",
              gross: {
                __typename: "Money",
                amount: 4,
                currency: "USD",
              },
            },
          },
          quantity: 1,
        },
        {
          __typename: "FulfillmentLine",
          id: "3-fulfillment-2",
          orderLine: {
            __typename: "OrderLine",
            id: "3-line-2",
            productName: "Milk 2",
            quantity: 4,
            thumbnail: undefined,
            unitPrice: {
              __typename: "TaxedMoney",
              gross: {
                __typename: "Money",
                amount: 4,
                currency: "USD",
              },
            },
          },
          quantity: 1,
        },
        {
          __typename: "FulfillmentLine",
          id: "3-fulfillment-3",
          orderLine: {
            __typename: "OrderLine",
            id: "3-line-3",
            productName: "Milk 3",
            quantity: 4,
            thumbnail: undefined,
            unitPrice: {
              __typename: "TaxedMoney",
              gross: {
                __typename: "Money",
                amount: 4,
                currency: "USD",
              },
            },
          },
          quantity: 1,
        },
      ],
      status: FulfillmentStatus.FULFILLED,
    },
  ];

  it("is able to sum fulfillment lines prices", () => {
    const refundedFulfilledProductQuantities: FormsetData<null, string> = [
      {
        data: null,
        id: "1-fulfillment-1",
        label: null,
        value: "1",
      },
      {
        data: null,
        id: "2-fulfillment-1",
        label: null,
        value: "1",
      },
      {
        data: null,
        id: "2-fulfillment-2",
        label: null,
        value: "1",
      },
      {
        data: null,
        id: "3-fulfillment-1",
        label: null,
        value: "1",
      },
      {
        data: null,
        id: "3-fulfillment-2",
        label: null,
        value: "1",
      },
      {
        data: null,
        id: "3-fulfillment-3",
        label: null,
        value: "1",
      },
    ];

    const allFulfillmentLinesPriceSum = getAllFulfillmentLinesPriceSum(
      fulfillments,
      refundedFulfilledProductQuantities,
    );

    expect(allFulfillmentLinesPriceSum).toBe(34);
  });

  it("is able to sum fulfillment lines prices multiplied by different quantities", () => {
    const refundedFulfilledProductQuantities: FormsetData<null, string> = [
      {
        data: null,
        id: "1-fulfillment-1",
        label: null,
        value: "0",
      },
      {
        data: null,
        id: "2-fulfillment-1",
        label: null,
        value: "2",
      },
      {
        data: null,
        id: "2-fulfillment-2",
        label: null,
        value: "2",
      },
      {
        data: null,
        id: "3-fulfillment-1",
        label: null,
        value: "4",
      },
      {
        data: null,
        id: "3-fulfillment-2",
        label: null,
        value: "4",
      },
      {
        data: null,
        id: "3-fulfillment-3",
        label: null,
        value: "4",
      },
    ];

    const allFulfillmentLinesPriceSum = getAllFulfillmentLinesPriceSum(
      fulfillments,
      refundedFulfilledProductQuantities,
    );

    expect(allFulfillmentLinesPriceSum).toBe(72);
  });
});

describe("Get the total value of all replaced products", () => {
  it("sums up correctly", () => {
    const unfulfilledLines: OrderLineWithMetadataFragment[] = [
      {
        id: "1",
        isShippingRequired: false,
        isGift: false,
        allocations: [
          {
            id: "allocation_test_id",
            warehouse: {
              name: "US Warehouse",
              id: "V2FyZWhvdXNlOjk1NWY0ZDk2LWRmNTAtNGY0Zi1hOTM4LWM5MTYzYTA4YTViNg==",
              __typename: "Warehouse",
            },
            quantity: 1,
            __typename: "Allocation",
          },
        ],
        variant: {
          id: "UHJvZHVjdFZhcmlhbnQ6MzE3",
          name: "Milk 1",
          quantityAvailable: 50,
          metadata: [],
          privateMetadata: [],
          preorder: null,
          __typename: "ProductVariant",
          product: {
            __typename: "Product",
            isAvailableForPurchase: true,
            id: "UHJvZHVjdDo1",
          },
          stocks: [
            {
              id: "stock_test_id1",
              warehouse: {
                name: "warehouse_stock1",
                id: "V2FyZWhvdXNlOjc4OGUyMGRlLTlmYTAtNDI5My1iZDk2LWUwM2RjY2RhMzc0ZQ==",
                __typename: "Warehouse",
              },
              quantity: 166,
              quantityAllocated: 0,
              __typename: "Stock",
            },
            {
              id: "stock_test_id2",
              warehouse: {
                name: "warehouse_stock2",
                id: "V2FyZWhvdXNlOjczYzI0OGNmLTliNzAtNDlmMi1hMDRlLTM4ZTYxMmQ5MDYwMQ==",
                __typename: "Warehouse",
              },
              quantity: 166,
              quantityAllocated: 0,
              __typename: "Stock",
            },
          ],
        },
        productName: "Lake Tunes",
        productSku: "lake-tunes-mp3",
        quantity: 2,
        quantityFulfilled: 2,
        quantityToFulfill: 0,
        totalPrice: {
          __typename: "TaxedMoney",
          gross: {
            __typename: "Money",
            amount: 159.42,
            currency: "USD",
          },
          net: {
            __typename: "Money",
            amount: 159.42,
            currency: "USD",
          },
        },
        undiscountedUnitPrice: {
          __typename: "TaxedMoney",
          currency: "USD",
          gross: {
            __typename: "Money",
            amount: 79.71,
            currency: "USD",
          },
          net: {
            __typename: "Money",
            amount: 79.71,
            currency: "USD",
          },
        },
        unitDiscount: {
          __typename: "Money",
          amount: 79.71,
          currency: "USD",
        },
        unitDiscountReason: null,
        unitDiscountType: null,
        unitDiscountValue: 0,
        unitPrice: {
          gross: {
            amount: 9.99,
            currency: "USD",
            __typename: "Money",
          },
          net: {
            amount: 9.99,
            currency: "USD",
            __typename: "Money",
          },
          __typename: "TaxedMoney",
        },
        thumbnail: {
          url: "http://localhost:8000/media/__sized__/products/saleor-digital-03_2-thumbnail-255x255.png",
          __typename: "Image",
        },
        __typename: "OrderLine",
      },
      {
        id: "2",
        isShippingRequired: false,
        isGift: false,

        allocations: [
          {
            id: "allocation_test_id",
            warehouse: {
              name: "US Warehouse",
              id: "V2FyZWhvdXNlOjk1NWY0ZDk2LWRmNTAtNGY0Zi1hOTM4LWM5MTYzYTA4YTViNg==",
              __typename: "Warehouse",
            },
            quantity: 1,
            __typename: "Allocation",
          },
        ],
        variant: {
          id: "UHJvZHVjdFZhcmlhbnQ6MzE3",
          name: "Milk 1",
          quantityAvailable: 50,
          preorder: null,
          metadata: [],
          privateMetadata: [],
          stocks: [
            {
              id: "stock_test_id1",
              warehouse: {
                name: "warehouse_stock1",
                id: "V2FyZWhvdXNlOjc4OGUyMGRlLTlmYTAtNDI5My1iZDk2LWUwM2RjY2RhMzc0ZQ==",
                __typename: "Warehouse",
              },
              quantity: 166,
              quantityAllocated: 0,
              __typename: "Stock",
            },
            {
              id: "stock_test_id2",
              warehouse: {
                name: "warehouse_stock2",
                id: "V2FyZWhvdXNlOjczYzI0OGNmLTliNzAtNDlmMi1hMDRlLTM4ZTYxMmQ5MDYwMQ==",
                __typename: "Warehouse",
              },
              quantity: 166,
              quantityAllocated: 0,
              __typename: "Stock",
            },
          ],
          __typename: "ProductVariant",
          product: {
            __typename: "Product",
            id: "UHJvZHVjdDo1",
            isAvailableForPurchase: true,
          },
        },
        productName: "Lake Tunes",
        productSku: "lake-tunes-mp3",
        quantity: 10,
        quantityFulfilled: 2,
        quantityToFulfill: 8,
        totalPrice: {
          __typename: "TaxedMoney",
          gross: {
            __typename: "Money",
            amount: 797.1,
            currency: "USD",
          },
          net: {
            __typename: "Money",
            amount: 797.1,
            currency: "USD",
          },
        },
        undiscountedUnitPrice: {
          __typename: "TaxedMoney",
          currency: "USD",
          gross: {
            __typename: "Money",
            amount: 79.71,
            currency: "USD",
          },
          net: {
            __typename: "Money",
            amount: 79.71,
            currency: "USD",
          },
        },
        unitDiscount: {
          __typename: "Money",
          amount: 79.71,
          currency: "USD",
        },
        unitDiscountReason: null,
        unitDiscountType: null,
        unitDiscountValue: 0,
        unitPrice: {
          gross: {
            amount: 9.99,
            currency: "USD",
            __typename: "Money",
          },
          net: {
            amount: 9.99,
            currency: "USD",
            __typename: "Money",
          },
          __typename: "TaxedMoney",
        },
        thumbnail: {
          url: "http://localhost:8000/media/__sized__/products/saleor-digital-03_2-thumbnail-255x255.png",
          __typename: "Image",
        },
        __typename: "OrderLine",
      },
      {
        id: "3",
        isShippingRequired: true,
        isGift: false,

        allocations: [
          {
            id: "allocation_test_id",
            warehouse: {
              name: "US Warehouse",
              id: "V2FyZWhvdXNlOjk1NWY0ZDk2LWRmNTAtNGY0Zi1hOTM4LWM5MTYzYTA4YTViNg==",
              __typename: "Warehouse",
            },
            quantity: 1,
            __typename: "Allocation",
          },
        ],
        variant: {
          id: "UHJvZHVjdFZhcmlhbnQ6Mjg2",
          name: "Milk 2",
          quantityAvailable: 50,
          preorder: null,
          metadata: [],
          privateMetadata: [],
          stocks: [
            {
              id: "stock_test_id1",
              warehouse: {
                name: "warehouse_stock1",
                id: "V2FyZWhvdXNlOjc4OGUyMGRlLTlmYTAtNDI5My1iZDk2LWUwM2RjY2RhMzc0ZQ==",
                __typename: "Warehouse",
              },
              quantity: 166,
              quantityAllocated: 0,
              __typename: "Stock",
            },
            {
              id: "stock_test_id2",
              warehouse: {
                name: "warehouse_stock2",
                id: "V2FyZWhvdXNlOjczYzI0OGNmLTliNzAtNDlmMi1hMDRlLTM4ZTYxMmQ5MDYwMQ==",
                __typename: "Warehouse",
              },
              quantity: 166,
              quantityAllocated: 0,
              __typename: "Stock",
            },
          ],
          __typename: "ProductVariant",
          product: {
            __typename: "Product",
            id: "UHJvZHVjdDo1",
            isAvailableForPurchase: true,
          },
        },
        productName: "T-shirt",
        productSku: "29810068",
        quantity: 6,
        quantityFulfilled: 1,
        quantityToFulfill: 5,
        totalPrice: {
          __typename: "TaxedMoney",
          gross: {
            __typename: "Money",
            amount: 478.26,
            currency: "USD",
          },
          net: {
            __typename: "Money",
            amount: 478.26,
            currency: "USD",
          },
        },
        undiscountedUnitPrice: {
          __typename: "TaxedMoney",
          currency: "USD",
          gross: {
            __typename: "Money",
            amount: 79.71,
            currency: "USD",
          },
          net: {
            __typename: "Money",
            amount: 79.71,
            currency: "USD",
          },
        },
        unitDiscount: {
          __typename: "Money",
          amount: 79.71,
          currency: "USD",
        },
        unitDiscountReason: null,
        unitDiscountType: null,
        unitDiscountValue: 0,
        unitPrice: {
          gross: {
            amount: 2.5,
            currency: "USD",
            __typename: "Money",
          },
          net: {
            amount: 2.5,
            currency: "USD",
            __typename: "Money",
          },
          __typename: "TaxedMoney",
        },
        thumbnail: {
          url: "http://localhost:8000/media/__sized__/products/saleordemoproduct_cl_boot06_1-thumbnail-255x255.png",
          __typename: "Image",
        },
        __typename: "OrderLine",
      },
    ];

    const fulfilledLines: OrderDetailsWithMetadataFragment["fulfillments"][0]["lines"] =
      [
        {
          id: "4",
          quantity: 1,
          orderLine: {
            id: "T3JkZXJMaW5lOjQ1",
            isShippingRequired: false,
            isGift: false,

            allocations: [
              {
                id: "allocation_test_id",
                warehouse: {
                  name: "US Warehouse",
                  id: "V2FyZWhvdXNlOjk1NWY0ZDk2LWRmNTAtNGY0Zi1hOTM4LWM5MTYzYTA4YTViNg==",
                  __typename: "Warehouse",
                },
                quantity: 1,
                __typename: "Allocation",
              },
            ],
            variant: {
              id: "UHJvZHVjdFZhcmlhbnQ6MzE3",
              name: "Milk 1",
              quantityAvailable: 50,
              preorder: null,
              metadata: [],
              privateMetadata: [],
              stocks: [
                {
                  id: "stock_test_id1",
                  warehouse: {
                    name: "warehouse_stock1",
                    id: "V2FyZWhvdXNlOjc4OGUyMGRlLTlmYTAtNDI5My1iZDk2LWUwM2RjY2RhMzc0ZQ==",
                    __typename: "Warehouse",
                  },
                  quantity: 166,
                  quantityAllocated: 0,
                  __typename: "Stock",
                },
                {
                  id: "stock_test_id2",
                  warehouse: {
                    name: "warehouse_stock2",
                    id: "V2FyZWhvdXNlOjczYzI0OGNmLTliNzAtNDlmMi1hMDRlLTM4ZTYxMmQ5MDYwMQ==",
                    __typename: "Warehouse",
                  },
                  quantity: 166,
                  quantityAllocated: 0,
                  __typename: "Stock",
                },
              ],
              __typename: "ProductVariant",
              product: {
                __typename: "Product",
                id: "UHJvZHVjdDo1",
                isAvailableForPurchase: true,
              },
            },
            productName: "Lake Tunes",
            productSku: "lake-tunes-mp3",
            quantity: 20,
            quantityFulfilled: 6,
            quantityToFulfill: 14,
            totalPrice: {
              __typename: "TaxedMoney",
              gross: {
                __typename: "Money",
                amount: 1594.2,
                currency: "USD",
              },
              net: {
                __typename: "Money",
                amount: 1594.2,
                currency: "USD",
              },
            },
            undiscountedUnitPrice: {
              __typename: "TaxedMoney",
              currency: "USD",
              gross: {
                __typename: "Money",
                amount: 79.71,
                currency: "USD",
              },
              net: {
                __typename: "Money",
                amount: 79.71,
                currency: "USD",
              },
            },
            unitDiscount: {
              __typename: "Money",
              amount: 79.71,
              currency: "USD",
            },
            unitDiscountReason: null,
            unitDiscountType: null,
            unitDiscountValue: 0,
            unitPrice: {
              gross: {
                amount: 9.99,
                currency: "USD",
                __typename: "Money",
              },
              net: {
                amount: 9.99,
                currency: "USD",
                __typename: "Money",
              },
              __typename: "TaxedMoney",
            },
            thumbnail: {
              url: "http://localhost:8000/media/__sized__/products/saleor-digital-03_2-thumbnail-255x255.png",
              __typename: "Image",
            },
            __typename: "OrderLine",
          },
          __typename: "FulfillmentLine",
        },
        {
          id: "5",
          quantity: 1,
          orderLine: {
            id: "T3JkZXJMaW5lOjQ1",
            isShippingRequired: false,
            isGift: false,
            allocations: [
              {
                id: "allocation_test_id",
                warehouse: {
                  name: "US Warehouse",
                  id: "V2FyZWhvdXNlOjk1NWY0ZDk2LWRmNTAtNGY0Zi1hOTM4LWM5MTYzYTA4YTViNg==",
                  __typename: "Warehouse",
                },
                quantity: 1,
                __typename: "Allocation",
              },
            ],
            variant: {
              id: "UHJvZHVjdFZhcmlhbnQ6MzE3",
              name: "Milk 1",
              quantityAvailable: 50,
              preorder: null,
              metadata: [],
              privateMetadata: [],
              stocks: [
                {
                  id: "stock_test_id1",
                  warehouse: {
                    name: "warehouse_stock1",
                    id: "V2FyZWhvdXNlOjc4OGUyMGRlLTlmYTAtNDI5My1iZDk2LWUwM2RjY2RhMzc0ZQ==",
                    __typename: "Warehouse",
                  },
                  quantity: 166,
                  quantityAllocated: 0,
                  __typename: "Stock",
                },
                {
                  id: "stock_test_id2",
                  warehouse: {
                    name: "warehouse_stock2",
                    id: "V2FyZWhvdXNlOjczYzI0OGNmLTliNzAtNDlmMi1hMDRlLTM4ZTYxMmQ5MDYwMQ==",
                    __typename: "Warehouse",
                  },
                  quantity: 166,
                  quantityAllocated: 0,
                  __typename: "Stock",
                },
              ],
              __typename: "ProductVariant",
              product: {
                __typename: "Product",
                id: "UHJvZHVjdDo1",
                isAvailableForPurchase: true,
              },
            },
            productName: "Lake Tunes",
            productSku: "lake-tunes-mp3",
            quantity: 25,
            quantityFulfilled: 8,
            quantityToFulfill: 17,
            totalPrice: {
              __typename: "TaxedMoney",
              gross: {
                __typename: "Money",
                amount: 1992.75,
                currency: "USD",
              },
              net: {
                __typename: "Money",
                amount: 1992.75,
                currency: "USD",
              },
            },
            undiscountedUnitPrice: {
              __typename: "TaxedMoney",
              currency: "USD",
              gross: {
                __typename: "Money",
                amount: 79.71,
                currency: "USD",
              },
              net: {
                __typename: "Money",
                amount: 79.71,
                currency: "USD",
              },
            },
            unitDiscount: {
              __typename: "Money",
              amount: 79.71,
              currency: "USD",
            },
            unitDiscountReason: null,
            unitDiscountType: null,
            unitDiscountValue: 0,
            unitPrice: {
              gross: {
                amount: 9.99,
                currency: "USD",
                __typename: "Money",
              },
              net: {
                amount: 9.99,
                currency: "USD",
                __typename: "Money",
              },
              __typename: "TaxedMoney",
            },
            thumbnail: {
              url: "http://localhost:8000/media/__sized__/products/saleor-digital-03_2-thumbnail-255x255.png",
              __typename: "Image",
            },
            __typename: "OrderLine",
          },
          __typename: "FulfillmentLine",
        },
        {
          id: "6",
          quantity: 1,
          orderLine: {
            id: "T3JkZXJMaW5lOjQ3",
            isShippingRequired: true,
            isGift: false,
            allocations: [
              {
                id: "allocation_test_id",
                warehouse: {
                  name: "US Warehouse",
                  id: "V2FyZWhvdXNlOjk1NWY0ZDk2LWRmNTAtNGY0Zi1hOTM4LWM5MTYzYTA4YTViNg==",
                  __typename: "Warehouse",
                },
                quantity: 1,
                __typename: "Allocation",
              },
            ],
            variant: {
              id: "UHJvZHVjdFZhcmlhbnQ6Mjg2",
              name: "Milk 2",
              quantityAvailable: 50,
              preorder: null,
              metadata: [],
              privateMetadata: [],
              stocks: [
                {
                  id: "stock_test_id1",
                  warehouse: {
                    name: "warehouse_stock1",
                    id: "V2FyZWhvdXNlOjc4OGUyMGRlLTlmYTAtNDI5My1iZDk2LWUwM2RjY2RhMzc0ZQ==",
                    __typename: "Warehouse",
                  },
                  quantity: 166,
                  quantityAllocated: 0,
                  __typename: "Stock",
                },
                {
                  id: "stock_test_id2",
                  warehouse: {
                    name: "warehouse_stock2",
                    id: "V2FyZWhvdXNlOjczYzI0OGNmLTliNzAtNDlmMi1hMDRlLTM4ZTYxMmQ5MDYwMQ==",
                    __typename: "Warehouse",
                  },
                  quantity: 166,
                  quantityAllocated: 0,
                  __typename: "Stock",
                },
              ],
              __typename: "ProductVariant",
              product: {
                __typename: "Product",
                id: "UHJvZHVjdDo1",
                isAvailableForPurchase: true,
              },
            },
            productName: "T-shirt",
            productSku: "29810068",
            quantity: 10,
            quantityFulfilled: 3,
            quantityToFulfill: 7,
            totalPrice: {
              __typename: "TaxedMoney",
              gross: {
                __typename: "Money",
                amount: 797.1,
                currency: "USD",
              },
              net: {
                __typename: "Money",
                amount: 797.1,
                currency: "USD",
              },
            },
            undiscountedUnitPrice: {
              __typename: "TaxedMoney",
              currency: "USD",
              gross: {
                __typename: "Money",
                amount: 79.71,
                currency: "USD",
              },
              net: {
                __typename: "Money",
                amount: 79.71,
                currency: "USD",
              },
            },
            unitDiscount: {
              __typename: "Money",
              amount: 79.71,
              currency: "USD",
            },
            unitDiscountReason: null,
            unitDiscountType: null,
            unitDiscountValue: 0,
            unitPrice: {
              gross: {
                amount: 2.5,
                currency: "USD",
                __typename: "Money",
              },
              net: {
                amount: 2.5,
                currency: "USD",
                __typename: "Money",
              },
              __typename: "TaxedMoney",
            },
            thumbnail: {
              url: "http://localhost:8000/media/__sized__/products/saleordemoproduct_cl_boot06_1-thumbnail-255x255.png",
              __typename: "Image",
            },
            __typename: "OrderLine",
          },
          __typename: "FulfillmentLine",
        },
        {
          id: "7",
          quantity: 1,
          orderLine: {
            id: "T3JkZXJMaW5lOjQ1",
            isShippingRequired: false,
            isGift: false,
            allocations: [
              {
                id: "allocation_test_id",
                warehouse: {
                  name: "US Warehouse",
                  id: "V2FyZWhvdXNlOjk1NWY0ZDk2LWRmNTAtNGY0Zi1hOTM4LWM5MTYzYTA4YTViNg==",
                  __typename: "Warehouse",
                },
                quantity: 1,
                __typename: "Allocation",
              },
            ],
            variant: {
              id: "UHJvZHVjdFZhcmlhbnQ6MzE3",
              name: "Milk 3",
              quantityAvailable: 50,
              preorder: null,
              metadata: [],
              privateMetadata: [],
              stocks: [
                {
                  id: "stock_test_id1",
                  warehouse: {
                    name: "warehouse_stock1",
                    id: "V2FyZWhvdXNlOjc4OGUyMGRlLTlmYTAtNDI5My1iZDk2LWUwM2RjY2RhMzc0ZQ==",
                    __typename: "Warehouse",
                  },
                  quantity: 166,
                  quantityAllocated: 0,
                  __typename: "Stock",
                },
                {
                  id: "stock_test_id2",
                  warehouse: {
                    name: "warehouse_stock2",
                    id: "V2FyZWhvdXNlOjczYzI0OGNmLTliNzAtNDlmMi1hMDRlLTM4ZTYxMmQ5MDYwMQ==",
                    __typename: "Warehouse",
                  },
                  quantity: 166,
                  quantityAllocated: 0,
                  __typename: "Stock",
                },
              ],
              __typename: "ProductVariant",
              product: {
                __typename: "Product",
                id: "UHJvZHVjdDo1",
                isAvailableForPurchase: true,
              },
            },
            productName: "Lake Tunes",
            productSku: "lake-tunes-mp3",
            quantity: 20,
            quantityFulfilled: 6,
            quantityToFulfill: 14,
            totalPrice: {
              __typename: "TaxedMoney",
              gross: {
                __typename: "Money",
                amount: 1594.2,
                currency: "USD",
              },
              net: {
                __typename: "Money",
                amount: 1594.2,
                currency: "USD",
              },
            },
            undiscountedUnitPrice: {
              __typename: "TaxedMoney",
              currency: "USD",
              gross: {
                __typename: "Money",
                amount: 79.71,
                currency: "USD",
              },
              net: {
                __typename: "Money",
                amount: 79.71,
                currency: "USD",
              },
            },
            unitDiscount: {
              __typename: "Money",
              amount: 79.71,
              currency: "USD",
            },
            unitDiscountReason: null,
            unitDiscountType: null,
            unitDiscountValue: 0,
            unitPrice: {
              gross: {
                amount: 9.99,
                currency: "USD",
                __typename: "Money",
              },
              net: {
                amount: 9.99,
                currency: "USD",
                __typename: "Money",
              },
              __typename: "TaxedMoney",
            },
            thumbnail: {
              url: "http://localhost:8000/media/__sized__/products/saleor-digital-03_2-thumbnail-255x255.png",
              __typename: "Image",
            },
            __typename: "OrderLine",
          },
          __typename: "FulfillmentLine",
        },
        {
          id: "8",
          quantity: 1,
          orderLine: {
            id: "T3JkZXJMaW5lOjQ1",
            isShippingRequired: false,
            isGift: false,
            allocations: [
              {
                id: "allocation_test_id",
                warehouse: {
                  name: "US Warehouse",
                  id: "V2FyZWhvdXNlOjk1NWY0ZDk2LWRmNTAtNGY0Zi1hOTM4LWM5MTYzYTA4YTViNg==",
                  __typename: "Warehouse",
                },
                quantity: 1,
                __typename: "Allocation",
              },
            ],
            variant: {
              id: "UHJvZHVjdFZhcmlhbnQ6MzE3",
              name: "Milk 3",
              quantityAvailable: 50,
              preorder: null,
              metadata: [],
              privateMetadata: [],
              stocks: [
                {
                  id: "stock_test_id1",
                  warehouse: {
                    name: "warehouse_stock1",
                    id: "V2FyZWhvdXNlOjc4OGUyMGRlLTlmYTAtNDI5My1iZDk2LWUwM2RjY2RhMzc0ZQ==",
                    __typename: "Warehouse",
                  },
                  quantity: 166,
                  quantityAllocated: 0,
                  __typename: "Stock",
                },
                {
                  id: "stock_test_id2",
                  warehouse: {
                    name: "warehouse_stock2",
                    id: "V2FyZWhvdXNlOjczYzI0OGNmLTliNzAtNDlmMi1hMDRlLTM4ZTYxMmQ5MDYwMQ==",
                    __typename: "Warehouse",
                  },
                  quantity: 166,
                  quantityAllocated: 0,
                  __typename: "Stock",
                },
              ],
              __typename: "ProductVariant",
              product: {
                __typename: "Product",
                id: "UHJvZHVjdDo1",
                isAvailableForPurchase: true,
              },
            },
            productName: "Lake Tunes",
            productSku: "lake-tunes-mp3",
            quantity: 25,
            quantityFulfilled: 8,
            quantityToFulfill: 17,
            totalPrice: {
              __typename: "TaxedMoney",
              gross: {
                __typename: "Money",
                amount: 1992.75,
                currency: "USD",
              },
              net: {
                __typename: "Money",
                amount: 1992.75,
                currency: "USD",
              },
            },
            undiscountedUnitPrice: {
              __typename: "TaxedMoney",
              currency: "USD",
              gross: {
                __typename: "Money",
                amount: 79.71,
                currency: "USD",
              },
              net: {
                __typename: "Money",
                amount: 79.71,
                currency: "USD",
              },
            },
            unitDiscount: {
              __typename: "Money",
              amount: 79.71,
              currency: "USD",
            },
            unitDiscountReason: null,
            unitDiscountType: null,
            unitDiscountValue: 0,
            unitPrice: {
              gross: {
                amount: 9.99,
                currency: "USD",
                __typename: "Money",
              },
              net: {
                amount: 9.99,
                currency: "USD",
                __typename: "Money",
              },
              __typename: "TaxedMoney",
            },
            thumbnail: {
              url: "http://localhost:8000/media/__sized__/products/saleor-digital-03_2-thumbnail-255x255.png",
              __typename: "Image",
            },
            __typename: "OrderLine",
          },
          __typename: "FulfillmentLine",
        },
      ];

    const unfulfilledItemsQuantities: FormsetData<LineItemData, number> = [
      {
        data: { isFulfillment: false, isRefunded: false, orderLineId: "1" },
        id: "1",
        label: null,
        value: 0,
      },
      {
        data: { isFulfillment: false, isRefunded: false, orderLineId: "2" },
        id: "2",
        label: null,
        value: 2,
      },
      {
        data: { isFulfillment: false, isRefunded: false, orderLineId: "3" },
        id: "3",
        label: null,
        value: 1,
      },
    ];

    const fulfilledItemsQuantities: FormsetData<LineItemData, number> = [
      {
        data: { isFulfillment: true, isRefunded: false, orderLineId: "4" },
        id: "4",
        label: null,
        value: 4,
      },
      {
        data: { isFulfillment: true, isRefunded: false, orderLineId: "5" },
        id: "5",
        label: null,
        value: 0,
      },
      {
        data: { isFulfillment: true, isRefunded: false, orderLineId: "6" },
        id: "6",
        label: null,
        value: 3,
      },
      {
        data: { isFulfillment: true, isRefunded: true, orderLineId: "7" },
        id: "7",
        label: null,
        value: 4,
      },
      {
        data: { isFulfillment: true, isRefunded: true, orderLineId: "8" },
        id: "8",
        label: null,
        value: 3,
      },
    ];

    const itemsToBeReplaced: FormsetData<LineItemData, boolean> = [
      {
        data: { isFulfillment: false, isRefunded: false, orderLineId: "1" },
        id: "1",
        label: null,
        value: true,
      },
      {
        data: { isFulfillment: false, isRefunded: false, orderLineId: "2" },
        id: "2",
        label: null,
        value: false,
      },
      {
        data: { isFulfillment: false, isRefunded: false, orderLineId: "3" },
        id: "3",
        label: null,
        value: true,
      },
      {
        data: { isFulfillment: true, isRefunded: false, orderLineId: "4" },
        id: "4",
        label: null,
        value: false,
      },
      {
        data: { isFulfillment: true, isRefunded: false, orderLineId: "5" },
        id: "5",
        label: null,
        value: true,
      },
      {
        data: { isFulfillment: true, isRefunded: false, orderLineId: "6" },
        id: "6",
        label: null,
        value: true,
      },
      {
        data: { isFulfillment: true, isRefunded: true, orderLineId: "7" },
        id: "7",
        label: null,
        value: false,
      },
      {
        data: { isFulfillment: true, isRefunded: true, orderLineId: "8" },
        id: "8",
        label: null,
        value: true,
      },
    ];

    const totalValue = getReplacedProductsAmount(
      {
        ...orderBase,
        lines: unfulfilledLines,
        fulfillments: [
          {
            id: "#1",
            fulfillmentOrder: 1,
            status: FulfillmentStatus.FULFILLED,
            warehouse: null,
            trackingNumber: "",
            lines: fulfilledLines,
            __typename: "Fulfillment",
          },
        ],
      } as unknown as OrderDetailsFragment,
      {
        itemsToBeReplaced,
        unfulfilledItemsQuantities,
        fulfilledItemsQuantities,
      },
    );

    expect(totalValue).toBe(10);
  });
});

describe("Get the total value of all selected products", () => {
  it("sums up correctly", () => {
    const unfulfilledLines: OrderLineWithMetadataFragment[] = [
      {
        id: "1",
        isShippingRequired: false,
        isGift: false,
        allocations: [
          {
            id: "allocation_test_id",
            warehouse: {
              name: "US Warehouse",
              id: "V2FyZWhvdXNlOjk1NWY0ZDk2LWRmNTAtNGY0Zi1hOTM4LWM5MTYzYTA4YTViNg==",
              __typename: "Warehouse",
            },
            quantity: 1,
            __typename: "Allocation",
          },
        ],
        variant: {
          id: "UHJvZHVjdFZhcmlhbnQ6MzE3",
          name: "Digital Book",
          quantityAvailable: 50,
          preorder: null,
          metadata: [],
          privateMetadata: [],
          stocks: [
            {
              id: "stock_test_id1",
              warehouse: {
                name: "warehouse_stock1",
                id: "V2FyZWhvdXNlOjc4OGUyMGRlLTlmYTAtNDI5My1iZDk2LWUwM2RjY2RhMzc0ZQ==",
                __typename: "Warehouse",
              },
              quantity: 166,
              quantityAllocated: 0,
              __typename: "Stock",
            },
            {
              id: "stock_test_id2",
              warehouse: {
                name: "warehouse_stock2",
                id: "V2FyZWhvdXNlOjczYzI0OGNmLTliNzAtNDlmMi1hMDRlLTM4ZTYxMmQ5MDYwMQ==",
                __typename: "Warehouse",
              },
              quantity: 166,
              quantityAllocated: 0,
              __typename: "Stock",
            },
          ],
          __typename: "ProductVariant",
          product: {
            __typename: "Product",
            id: "UHJvZHVjdDo1",
            isAvailableForPurchase: true,
          },
        },
        productName: "Lake Tunes",
        productSku: "lake-tunes-mp3",
        quantity: 2,
        quantityFulfilled: 2,
        quantityToFulfill: 0,
        totalPrice: {
          __typename: "TaxedMoney",
          gross: {
            __typename: "Money",
            amount: 159.42,
            currency: "USD",
          },
          net: {
            __typename: "Money",
            amount: 159.42,
            currency: "USD",
          },
        },
        undiscountedUnitPrice: {
          __typename: "TaxedMoney",
          currency: "USD",
          gross: {
            __typename: "Money",
            amount: 79.71,
            currency: "USD",
          },
          net: {
            __typename: "Money",
            amount: 79.71,
            currency: "USD",
          },
        },
        unitDiscount: {
          __typename: "Money",
          amount: 79.71,
          currency: "USD",
        },
        unitDiscountReason: null,
        unitDiscountType: null,
        unitDiscountValue: 0,
        unitPrice: {
          gross: {
            amount: 9.99,
            currency: "USD",
            __typename: "Money",
          },
          net: {
            amount: 9.99,
            currency: "USD",
            __typename: "Money",
          },
          __typename: "TaxedMoney",
        },
        thumbnail: {
          url: "http://localhost:8000/media/__sized__/products/saleor-digital-03_2-thumbnail-255x255.png",
          __typename: "Image",
        },
        __typename: "OrderLine",
      },
      {
        id: "2",
        isShippingRequired: false,
        isGift: false,
        allocations: [
          {
            id: "allocation_test_id",
            warehouse: {
              name: "US Warehouse",
              id: "V2FyZWhvdXNlOjk1NWY0ZDk2LWRmNTAtNGY0Zi1hOTM4LWM5MTYzYTA4YTViNg==",
              __typename: "Warehouse",
            },
            quantity: 1,
            __typename: "Allocation",
          },
        ],
        variant: {
          id: "UHJvZHVjdFZhcmlhbnQ6MzE3",
          name: "Digital Book",
          quantityAvailable: 50,
          preorder: null,
          metadata: [],
          privateMetadata: [],
          stocks: [
            {
              id: "stock_test_id1",
              warehouse: {
                name: "warehouse_stock1",
                id: "V2FyZWhvdXNlOjc4OGUyMGRlLTlmYTAtNDI5My1iZDk2LWUwM2RjY2RhMzc0ZQ==",
                __typename: "Warehouse",
              },
              quantity: 166,
              quantityAllocated: 0,
              __typename: "Stock",
            },
            {
              id: "stock_test_id2",
              warehouse: {
                name: "warehouse_stock2",
                id: "V2FyZWhvdXNlOjczYzI0OGNmLTliNzAtNDlmMi1hMDRlLTM4ZTYxMmQ5MDYwMQ==",
                __typename: "Warehouse",
              },
              quantity: 166,
              quantityAllocated: 0,
              __typename: "Stock",
            },
          ],
          __typename: "ProductVariant",
          product: {
            __typename: "Product",
            id: "UHJvZHVjdDo1",
            isAvailableForPurchase: true,
          },
        },
        productName: "Lake Tunes",
        productSku: "lake-tunes-mp3",
        quantity: 10,
        quantityFulfilled: 2,
        quantityToFulfill: 8,
        totalPrice: {
          __typename: "TaxedMoney",
          gross: {
            __typename: "Money",
            amount: 797.1,
            currency: "USD",
          },
          net: {
            __typename: "Money",
            amount: 797.1,
            currency: "USD",
          },
        },
        undiscountedUnitPrice: {
          __typename: "TaxedMoney",
          currency: "USD",
          gross: {
            __typename: "Money",
            amount: 79.71,
            currency: "USD",
          },
          net: {
            __typename: "Money",
            amount: 79.71,
            currency: "USD",
          },
        },
        unitDiscount: {
          __typename: "Money",
          amount: 79.71,
          currency: "USD",
        },
        unitDiscountReason: null,
        unitDiscountType: null,
        unitDiscountValue: 0,
        unitPrice: {
          gross: {
            amount: 9.99,
            currency: "USD",
            __typename: "Money",
          },
          net: {
            amount: 9.99,
            currency: "USD",
            __typename: "Money",
          },
          __typename: "TaxedMoney",
        },
        thumbnail: {
          url: "http://localhost:8000/media/__sized__/products/saleor-digital-03_2-thumbnail-255x255.png",
          __typename: "Image",
        },
        __typename: "OrderLine",
      },
      {
        id: "3",
        isShippingRequired: true,
        isGift: false,
        allocations: [
          {
            id: "allocation_test_id",
            warehouse: {
              name: "US Warehouse",
              id: "V2FyZWhvdXNlOjk1NWY0ZDk2LWRmNTAtNGY0Zi1hOTM4LWM5MTYzYTA4YTViNg==",
              __typename: "Warehouse",
            },
            quantity: 1,
            __typename: "Allocation",
          },
        ],
        variant: {
          id: "UHJvZHVjdFZhcmlhbnQ6Mjg2",
          name: "Digital Book",
          quantityAvailable: 50,
          preorder: null,
          metadata: [],
          privateMetadata: [],
          stocks: [
            {
              id: "stock_test_id1",
              warehouse: {
                name: "warehouse_stock1",
                id: "V2FyZWhvdXNlOjc4OGUyMGRlLTlmYTAtNDI5My1iZDk2LWUwM2RjY2RhMzc0ZQ==",
                __typename: "Warehouse",
              },
              quantity: 166,
              quantityAllocated: 0,
              __typename: "Stock",
            },
            {
              id: "stock_test_id2",
              warehouse: {
                name: "warehouse_stock2",
                id: "V2FyZWhvdXNlOjczYzI0OGNmLTliNzAtNDlmMi1hMDRlLTM4ZTYxMmQ5MDYwMQ==",
                __typename: "Warehouse",
              },
              quantity: 166,
              quantityAllocated: 0,
              __typename: "Stock",
            },
          ],
          __typename: "ProductVariant",
          product: {
            __typename: "Product",
            id: "UHJvZHVjdDo1",
            isAvailableForPurchase: true,
          },
        },
        productName: "T-shirt",
        productSku: "29810068",
        quantity: 6,
        quantityFulfilled: 1,
        quantityToFulfill: 5,
        totalPrice: {
          __typename: "TaxedMoney",
          gross: {
            __typename: "Money",
            amount: 478.26,
            currency: "USD",
          },
          net: {
            __typename: "Money",
            amount: 478.26,
            currency: "USD",
          },
        },
        undiscountedUnitPrice: {
          __typename: "TaxedMoney",
          currency: "USD",
          gross: {
            __typename: "Money",
            amount: 79.71,
            currency: "USD",
          },
          net: {
            __typename: "Money",
            amount: 79.71,
            currency: "USD",
          },
        },
        unitDiscount: {
          __typename: "Money",
          amount: 79.71,
          currency: "USD",
        },
        unitDiscountReason: null,
        unitDiscountType: null,
        unitDiscountValue: 0,
        unitPrice: {
          gross: {
            amount: 2.5,
            currency: "USD",
            __typename: "Money",
          },
          net: {
            amount: 2.5,
            currency: "USD",
            __typename: "Money",
          },
          __typename: "TaxedMoney",
        },
        thumbnail: {
          url: "http://localhost:8000/media/__sized__/products/saleordemoproduct_cl_boot06_1-thumbnail-255x255.png",
          __typename: "Image",
        },
        __typename: "OrderLine",
      },
    ];

    const fulfilledLines: OrderDetailsWithMetadataFragment["fulfillments"][0]["lines"] =
      [
        {
          id: "4",
          quantity: 1,
          orderLine: {
            id: "T3JkZXJMaW5lOjQ1",
            isShippingRequired: false,
            isGift: false,
            allocations: [
              {
                id: "allocation_test_id",
                warehouse: {
                  name: "US Warehouse",
                  id: "V2FyZWhvdXNlOjk1NWY0ZDk2LWRmNTAtNGY0Zi1hOTM4LWM5MTYzYTA4YTViNg==",
                  __typename: "Warehouse",
                },
                quantity: 1,
                __typename: "Allocation",
              },
            ],
            variant: {
              id: "UHJvZHVjdFZhcmlhbnQ6MzE3",
              name: "Digital Book",
              quantityAvailable: 50,
              preorder: null,
              metadata: [],
              privateMetadata: [],
              stocks: [
                {
                  id: "stock_test_id1",
                  warehouse: {
                    name: "warehouse_stock1",
                    id: "V2FyZWhvdXNlOjc4OGUyMGRlLTlmYTAtNDI5My1iZDk2LWUwM2RjY2RhMzc0ZQ==",
                    __typename: "Warehouse",
                  },
                  quantity: 166,
                  quantityAllocated: 0,
                  __typename: "Stock",
                },
                {
                  id: "stock_test_id2",
                  warehouse: {
                    name: "warehouse_stock2",
                    id: "V2FyZWhvdXNlOjczYzI0OGNmLTliNzAtNDlmMi1hMDRlLTM4ZTYxMmQ5MDYwMQ==",
                    __typename: "Warehouse",
                  },
                  quantity: 166,
                  quantityAllocated: 0,
                  __typename: "Stock",
                },
              ],
              __typename: "ProductVariant",
              product: {
                __typename: "Product",
                id: "UHJvZHVjdDo1",
                isAvailableForPurchase: true,
              },
            },
            productName: "Lake Tunes",
            productSku: "lake-tunes-mp3",
            quantity: 20,
            quantityFulfilled: 6,
            quantityToFulfill: 14,
            totalPrice: {
              __typename: "TaxedMoney",
              gross: {
                __typename: "Money",
                amount: 1594.2,
                currency: "USD",
              },
              net: {
                __typename: "Money",
                amount: 1594.2,
                currency: "USD",
              },
            },
            undiscountedUnitPrice: {
              __typename: "TaxedMoney",
              currency: "USD",
              gross: {
                __typename: "Money",
                amount: 79.71,
                currency: "USD",
              },
              net: {
                __typename: "Money",
                amount: 79.71,
                currency: "USD",
              },
            },
            unitDiscount: {
              __typename: "Money",
              amount: 79.71,
              currency: "USD",
            },
            unitDiscountReason: null,
            unitDiscountType: null,
            unitDiscountValue: 0,
            unitPrice: {
              gross: {
                amount: 9.99,
                currency: "USD",
                __typename: "Money",
              },
              net: {
                amount: 9.99,
                currency: "USD",
                __typename: "Money",
              },
              __typename: "TaxedMoney",
            },
            thumbnail: {
              url: "http://localhost:8000/media/__sized__/products/saleor-digital-03_2-thumbnail-255x255.png",
              __typename: "Image",
            },
            __typename: "OrderLine",
          },
          __typename: "FulfillmentLine",
        },
        {
          id: "5",
          quantity: 1,
          orderLine: {
            id: "T3JkZXJMaW5lOjQ1",
            isShippingRequired: false,
            isGift: false,
            allocations: [
              {
                id: "allocation_test_id",
                warehouse: {
                  name: "US Warehouse",
                  id: "V2FyZWhvdXNlOjk1NWY0ZDk2LWRmNTAtNGY0Zi1hOTM4LWM5MTYzYTA4YTViNg==",
                  __typename: "Warehouse",
                },
                quantity: 1,
                __typename: "Allocation",
              },
            ],
            variant: {
              id: "UHJvZHVjdFZhcmlhbnQ6MzE3",
              name: "Digital Book",
              quantityAvailable: 50,
              metadata: [],
              privateMetadata: [],
              preorder: null,
              stocks: [
                {
                  id: "stock_test_id1",
                  warehouse: {
                    name: "warehouse_stock1",
                    id: "V2FyZWhvdXNlOjc4OGUyMGRlLTlmYTAtNDI5My1iZDk2LWUwM2RjY2RhMzc0ZQ==",
                    __typename: "Warehouse",
                  },
                  quantity: 166,
                  quantityAllocated: 0,
                  __typename: "Stock",
                },
                {
                  id: "stock_test_id2",
                  warehouse: {
                    name: "warehouse_stock2",
                    id: "V2FyZWhvdXNlOjczYzI0OGNmLTliNzAtNDlmMi1hMDRlLTM4ZTYxMmQ5MDYwMQ==",
                    __typename: "Warehouse",
                  },
                  quantity: 166,
                  quantityAllocated: 0,
                  __typename: "Stock",
                },
              ],
              __typename: "ProductVariant",
              product: {
                __typename: "Product",
                id: "UHJvZHVjdDo1",
                isAvailableForPurchase: true,
              },
            },
            productName: "Lake Tunes",
            productSku: "lake-tunes-mp3",
            quantity: 25,
            quantityFulfilled: 8,
            quantityToFulfill: 17,
            totalPrice: {
              __typename: "TaxedMoney",
              gross: {
                __typename: "Money",
                amount: 1992.75,
                currency: "USD",
              },
              net: {
                __typename: "Money",
                amount: 1992.75,
                currency: "USD",
              },
            },
            undiscountedUnitPrice: {
              __typename: "TaxedMoney",
              currency: "USD",
              gross: {
                __typename: "Money",
                amount: 79.71,
                currency: "USD",
              },
              net: {
                __typename: "Money",
                amount: 79.71,
                currency: "USD",
              },
            },
            unitDiscount: {
              __typename: "Money",
              amount: 79.71,
              currency: "USD",
            },
            unitDiscountReason: null,
            unitDiscountType: null,
            unitDiscountValue: 0,
            unitPrice: {
              gross: {
                amount: 9.99,
                currency: "USD",
                __typename: "Money",
              },
              net: {
                amount: 9.99,
                currency: "USD",
                __typename: "Money",
              },
              __typename: "TaxedMoney",
            },
            thumbnail: {
              url: "http://localhost:8000/media/__sized__/products/saleor-digital-03_2-thumbnail-255x255.png",
              __typename: "Image",
            },
            __typename: "OrderLine",
          },
          __typename: "FulfillmentLine",
        },
        {
          id: "6",
          quantity: 1,
          orderLine: {
            id: "T3JkZXJMaW5lOjQ3",
            isShippingRequired: true,
            isGift: false,
            allocations: [
              {
                id: "allocation_test_id",
                warehouse: {
                  name: "US Warehouse",
                  id: "V2FyZWhvdXNlOjk1NWY0ZDk2LWRmNTAtNGY0Zi1hOTM4LWM5MTYzYTA4YTViNg==",
                  __typename: "Warehouse",
                },
                quantity: 1,
                __typename: "Allocation",
              },
            ],
            variant: {
              id: "UHJvZHVjdFZhcmlhbnQ6Mjg2",
              name: "Digital Book",
              quantityAvailable: 50,
              preorder: null,
              metadata: [],
              privateMetadata: [],
              stocks: [
                {
                  id: "stock_test_id1",
                  warehouse: {
                    name: "warehouse_stock1",
                    id: "V2FyZWhvdXNlOjc4OGUyMGRlLTlmYTAtNDI5My1iZDk2LWUwM2RjY2RhMzc0ZQ==",
                    __typename: "Warehouse",
                  },
                  quantity: 166,
                  quantityAllocated: 0,
                  __typename: "Stock",
                },
                {
                  id: "stock_test_id2",
                  warehouse: {
                    name: "warehouse_stock2",
                    id: "V2FyZWhvdXNlOjczYzI0OGNmLTliNzAtNDlmMi1hMDRlLTM4ZTYxMmQ5MDYwMQ==",
                    __typename: "Warehouse",
                  },
                  quantity: 166,
                  quantityAllocated: 0,
                  __typename: "Stock",
                },
              ],
              __typename: "ProductVariant",
              product: {
                __typename: "Product",
                id: "UHJvZHVjdDo1",
                isAvailableForPurchase: true,
              },
            },
            productName: "T-shirt",
            productSku: "29810068",
            quantity: 10,
            quantityFulfilled: 3,
            quantityToFulfill: 7,
            totalPrice: {
              __typename: "TaxedMoney",
              gross: {
                __typename: "Money",
                amount: 797.1,
                currency: "USD",
              },
              net: {
                __typename: "Money",
                amount: 797.1,
                currency: "USD",
              },
            },
            undiscountedUnitPrice: {
              __typename: "TaxedMoney",
              currency: "USD",
              gross: {
                __typename: "Money",
                amount: 79.71,
                currency: "USD",
              },
              net: {
                __typename: "Money",
                amount: 79.71,
                currency: "USD",
              },
            },
            unitDiscount: {
              __typename: "Money",
              amount: 79.71,
              currency: "USD",
            },
            unitDiscountReason: null,
            unitDiscountType: null,
            unitDiscountValue: 0,
            unitPrice: {
              gross: {
                amount: 2.5,
                currency: "USD",
                __typename: "Money",
              },
              net: {
                amount: 2.5,
                currency: "USD",
                __typename: "Money",
              },
              __typename: "TaxedMoney",
            },
            thumbnail: {
              url: "http://localhost:8000/media/__sized__/products/saleordemoproduct_cl_boot06_1-thumbnail-255x255.png",
              __typename: "Image",
            },
            __typename: "OrderLine",
          },
          __typename: "FulfillmentLine",
        },
      ];

    const unfulfilledItemsQuantities: FormsetData<LineItemData, number> = [
      {
        data: { isFulfillment: false, isRefunded: false, orderLineId: "1" },
        id: "1",
        label: null,
        value: 0,
      },
      {
        data: { isFulfillment: false, isRefunded: false, orderLineId: "2" },
        id: "2",
        label: null,
        value: 2,
      },
      {
        data: { isFulfillment: false, isRefunded: false, orderLineId: "3" },
        id: "3",
        label: null,
        value: 1,
      },
    ];

    const fulfilledItemsQuantities: FormsetData<LineItemData, number> = [
      {
        data: { isFulfillment: true, isRefunded: false, orderLineId: "4" },
        id: "4",
        label: null,
        value: 4,
      },
      {
        data: { isFulfillment: true, isRefunded: false, orderLineId: "5" },
        id: "5",
        label: null,
        value: 0,
      },
      {
        data: { isFulfillment: true, isRefunded: false, orderLineId: "6" },
        id: "6",
        label: null,
        value: 3,
      },
    ];

    const waitingItemsQuantities: FormsetData<LineItemData, number> = [];

    const itemsToBeReplaced: FormsetData<LineItemData, boolean> = [
      {
        data: { isFulfillment: false, isRefunded: false, orderLineId: "1" },
        id: "1",
        label: null,
        value: true,
      },
      {
        data: { isFulfillment: false, isRefunded: false, orderLineId: "2" },
        id: "2",
        label: null,
        value: false,
      },
      {
        data: { isFulfillment: false, isRefunded: false, orderLineId: "3" },
        id: "3",
        label: null,
        value: true,
      },
      {
        data: { isFulfillment: true, isRefunded: false, orderLineId: "4" },
        id: "4",
        label: null,
        value: false,
      },
      {
        data: { isFulfillment: true, isRefunded: false, orderLineId: "5" },
        id: "5",
        label: null,
        value: true,
      },
      {
        data: { isFulfillment: true, isRefunded: false, orderLineId: "6" },
        id: "6",
        label: null,
        value: true,
      },
      {
        data: { isFulfillment: true, isRefunded: true, orderLineId: "7" },
        id: "7",
        label: null,
        value: true,
      },
      {
        data: { isFulfillment: true, isRefunded: true, orderLineId: "8" },
        id: "8",
        label: null,
        value: true,
      },
    ];

    const totalValue = getReturnSelectedProductsAmount(
      {
        ...orderBase,
        lines: unfulfilledLines,
        fulfillments: [
          {
            id: "#1",
            fulfillmentOrder: 1,
            status: FulfillmentStatus.FULFILLED,
            warehouse: null,
            trackingNumber: "",
            lines: fulfilledLines,
            __typename: "Fulfillment",
          },
        ],
      } as unknown as OrderDetailsFragment,
      {
        itemsToBeReplaced,
        waitingItemsQuantities,
        unfulfilledItemsQuantities,
        fulfilledItemsQuantities,
      },
    );

    expect(totalValue).toBe(59.94);
  });
});

describe("Merge repeated order lines of fulfillment lines", () => {
  it("is able to merge repeated order lines and sum their quantities", () => {
    const lines: OrderDetailsWithMetadataFragment["fulfillments"][0]["lines"] =
      [
        {
          id: "RnVsZmlsbG1lbnRMaW5lOjMx",
          quantity: 1,
          orderLine: {
            id: "T3JkZXJMaW5lOjQ1",
            isShippingRequired: false,
            isGift: false,
            allocations: [
              {
                id: "allocation_test_id",
                warehouse: {
                  name: "US Warehouse",
                  id: "V2FyZWhvdXNlOjk1NWY0ZDk2LWRmNTAtNGY0Zi1hOTM4LWM5MTYzYTA4YTViNg==",
                  __typename: "Warehouse",
                },
                quantity: 1,
                __typename: "Allocation",
              },
            ],
            variant: {
              id: "UHJvZHVjdFZhcmlhbnQ6MzE3",
              name: "Saleor Demo Product",
              quantityAvailable: 50,
              preorder: null,
              metadata: [],
              privateMetadata: [],
              stocks: [
                {
                  id: "stock_test_id1",
                  warehouse: {
                    name: "warehouse_stock1",
                    id: "V2FyZWhvdXNlOjc4OGUyMGRlLTlmYTAtNDI5My1iZDk2LWUwM2RjY2RhMzc0ZQ==",
                    __typename: "Warehouse",
                  },
                  quantity: 166,
                  quantityAllocated: 0,
                  __typename: "Stock",
                },
                {
                  id: "stock_test_id2",
                  warehouse: {
                    name: "warehouse_stock2",
                    id: "V2FyZWhvdXNlOjczYzI0OGNmLTliNzAtNDlmMi1hMDRlLTM4ZTYxMmQ5MDYwMQ==",
                    __typename: "Warehouse",
                  },
                  quantity: 166,
                  quantityAllocated: 0,
                  __typename: "Stock",
                },
              ],
              __typename: "ProductVariant",
              product: {
                __typename: "Product",
                id: "UHJvZHVjdDo1",
                isAvailableForPurchase: true,
              },
            },
            productName: "Lake Tunes",
            productSku: "lake-tunes-mp3",
            quantity: 2,
            quantityFulfilled: 2,
            quantityToFulfill: 0,
            totalPrice: {
              __typename: "TaxedMoney",
              gross: {
                __typename: "Money",
                amount: 159.42,
                currency: "USD",
              },
              net: {
                __typename: "Money",
                amount: 159.42,
                currency: "USD",
              },
            },
            undiscountedUnitPrice: {
              __typename: "TaxedMoney",
              currency: "USD",
              gross: {
                __typename: "Money",
                amount: 79.71,
                currency: "USD",
              },
              net: {
                __typename: "Money",
                amount: 79.71,
                currency: "USD",
              },
            },
            unitDiscount: {
              __typename: "Money",
              amount: 79.71,
              currency: "USD",
            },
            unitDiscountReason: null,
            unitDiscountType: null,
            unitDiscountValue: 0,
            unitPrice: {
              gross: {
                amount: 9.99,
                currency: "USD",
                __typename: "Money",
              },
              net: {
                amount: 9.99,
                currency: "USD",
                __typename: "Money",
              },
              __typename: "TaxedMoney",
            },
            thumbnail: {
              url: "http://localhost:8000/media/__sized__/products/saleor-digital-03_2-thumbnail-255x255.png",
              __typename: "Image",
            },
            __typename: "OrderLine",
          },
          __typename: "FulfillmentLine",
        },
        {
          id: "RnVsZmlsbG1lbnRMaW5lOjMy",
          quantity: 1,
          orderLine: {
            id: "T3JkZXJMaW5lOjQ1",
            isShippingRequired: false,
            isGift: false,
            allocations: [
              {
                id: "allocation_test_id",
                warehouse: {
                  name: "US Warehouse",
                  id: "V2FyZWhvdXNlOjk1NWY0ZDk2LWRmNTAtNGY0Zi1hOTM4LWM5MTYzYTA4YTViNg==",
                  __typename: "Warehouse",
                },
                quantity: 1,
                __typename: "Allocation",
              },
            ],
            variant: {
              id: "UHJvZHVjdFZhcmlhbnQ6MzE3",
              name: "Saleor Demo Product",
              quantityAvailable: 50,
              preorder: null,
              metadata: [],
              privateMetadata: [],
              stocks: [
                {
                  id: "stock_test_id1",
                  warehouse: {
                    name: "warehouse_stock1",
                    id: "V2FyZWhvdXNlOjc4OGUyMGRlLTlmYTAtNDI5My1iZDk2LWUwM2RjY2RhMzc0ZQ==",
                    __typename: "Warehouse",
                  },
                  quantity: 166,
                  quantityAllocated: 0,
                  __typename: "Stock",
                },
                {
                  id: "stock_test_id2",
                  warehouse: {
                    name: "warehouse_stock2",
                    id: "V2FyZWhvdXNlOjczYzI0OGNmLTliNzAtNDlmMi1hMDRlLTM4ZTYxMmQ5MDYwMQ==",
                    __typename: "Warehouse",
                  },
                  quantity: 166,
                  quantityAllocated: 0,
                  __typename: "Stock",
                },
              ],
              __typename: "ProductVariant",
              product: {
                __typename: "Product",
                id: "UHJvZHVjdDo1",
                isAvailableForPurchase: true,
              },
            },
            productName: "Lake Tunes",
            productSku: "lake-tunes-mp3",
            quantity: 2,
            quantityFulfilled: 2,
            quantityToFulfill: 0,
            totalPrice: {
              __typename: "TaxedMoney",
              gross: {
                __typename: "Money",
                amount: 159.42,
                currency: "USD",
              },
              net: {
                __typename: "Money",
                amount: 159.42,
                currency: "USD",
              },
            },
            undiscountedUnitPrice: {
              __typename: "TaxedMoney",
              currency: "USD",
              gross: {
                __typename: "Money",
                amount: 79.71,
                currency: "USD",
              },
              net: {
                __typename: "Money",
                amount: 79.71,
                currency: "USD",
              },
            },
            unitDiscount: {
              __typename: "Money",
              amount: 79.71,
              currency: "USD",
            },
            unitDiscountReason: null,
            unitDiscountType: null,
            unitDiscountValue: 0,
            unitPrice: {
              gross: {
                amount: 9.99,
                currency: "USD",
                __typename: "Money",
              },
              net: {
                amount: 9.99,
                currency: "USD",
                __typename: "Money",
              },
              __typename: "TaxedMoney",
            },
            thumbnail: {
              url: "http://localhost:8000/media/__sized__/products/saleor-digital-03_2-thumbnail-255x255.png",
              __typename: "Image",
            },
            __typename: "OrderLine",
          },
          __typename: "FulfillmentLine",
        },
        {
          id: "RnVsZmlsbG1lbnRMaW5lOjMz",
          quantity: 1,
          orderLine: {
            id: "T3JkZXJMaW5lOjQ3",
            isShippingRequired: true,
            isGift: false,
            allocations: [
              {
                id: "allocation_test_id",
                warehouse: {
                  name: "US Warehouse",
                  id: "V2FyZWhvdXNlOjk1NWY0ZDk2LWRmNTAtNGY0Zi1hOTM4LWM5MTYzYTA4YTViNg==",
                  __typename: "Warehouse",
                },
                quantity: 1,
                __typename: "Allocation",
              },
            ],
            variant: {
              id: "UHJvZHVjdFZhcmlhbnQ6Mjg2",
              name: "Saleor Demo Product",
              quantityAvailable: 50,
              preorder: null,
              metadata: [],
              privateMetadata: [],
              stocks: [
                {
                  id: "stock_test_id1",
                  warehouse: {
                    name: "warehouse_stock1",
                    id: "V2FyZWhvdXNlOjc4OGUyMGRlLTlmYTAtNDI5My1iZDk2LWUwM2RjY2RhMzc0ZQ==",
                    __typename: "Warehouse",
                  },
                  quantity: 166,
                  quantityAllocated: 0,
                  __typename: "Stock",
                },
                {
                  id: "stock_test_id2",
                  warehouse: {
                    name: "warehouse_stock2",
                    id: "V2FyZWhvdXNlOjczYzI0OGNmLTliNzAtNDlmMi1hMDRlLTM4ZTYxMmQ5MDYwMQ==",
                    __typename: "Warehouse",
                  },
                  quantity: 166,
                  quantityAllocated: 0,
                  __typename: "Stock",
                },
              ],
              __typename: "ProductVariant",
              product: {
                __typename: "Product",
                id: "UHJvZHVjdDo1",
                isAvailableForPurchase: true,
              },
            },
            productName: "T-shirt",
            productSku: "29810068",
            quantity: 3,
            quantityFulfilled: 1,
            quantityToFulfill: 2,
            totalPrice: {
              __typename: "TaxedMoney",
              gross: {
                __typename: "Money",
                amount: 239.13,
                currency: "USD",
              },
              net: {
                __typename: "Money",
                amount: 239.13,
                currency: "USD",
              },
            },
            undiscountedUnitPrice: {
              __typename: "TaxedMoney",
              currency: "USD",
              gross: {
                __typename: "Money",
                amount: 79.71,
                currency: "USD",
              },
              net: {
                __typename: "Money",
                amount: 79.71,
                currency: "USD",
              },
            },
            unitDiscount: {
              __typename: "Money",
              amount: 79.71,
              currency: "USD",
            },
            unitDiscountReason: null,
            unitDiscountType: null,
            unitDiscountValue: 0,
            unitPrice: {
              gross: {
                amount: 2.5,
                currency: "USD",
                __typename: "Money",
              },
              net: {
                amount: 2.5,
                currency: "USD",
                __typename: "Money",
              },
              __typename: "TaxedMoney",
            },
            thumbnail: {
              url: "http://localhost:8000/media/__sized__/products/saleordemoproduct_cl_boot06_1-thumbnail-255x255.png",
              __typename: "Image",
            },
            __typename: "OrderLine",
          },
          __typename: "FulfillmentLine",
        },
      ];

    const mergedLines = mergeRepeatedOrderLines(lines);

    expect(mergedLines).toHaveLength(2);
    expect(
      mergedLines.find(
        fulfillmentLine => fulfillmentLine.orderLine.id === "T3JkZXJMaW5lOjQ1",
      ).quantity,
    ).toBe(2);
  });
});

describe("Get discount type lable", () => {
  it("should return Staff added for manual discount", () => {
    // Arrange
    const discount = {
      type: OrderDiscountType.MANUAL,
    } as OrderDiscountFragment;

    // Act
    const result = getDiscountTypeLabel(discount, intlMock);

    // Assert
    expect(result).toBe("Staff added");
  });

  it("should return discount name when exists", () => {
    // Arrange
    const discount = {
      type: OrderDiscountType.ORDER_PROMOTION,
      name: "Subtotal discount: Test promotion",
    } as OrderDiscountFragment;

    // Act
    const result = getDiscountTypeLabel(discount, intlMock);

    // Assert
    expect(result).toBe("Subtotal discount");
  });

  it("should return  - when no discount name", () => {
    // Arrange
    const discount = {
      type: OrderDiscountType.ORDER_PROMOTION,
      name: " :Test promotion",
    } as OrderDiscountFragment;

    // Act
    const result = getDiscountTypeLabel(discount, intlMock);

    // Assert
    expect(result).toBe("-");
  });

  it("should return voucher when voucher discount type", () => {
    // Arrange
    const discount = {
      type: OrderDiscountType.VOUCHER,
    } as OrderDiscountFragment;

    // Act
    const result = getDiscountTypeLabel(discount, intlMock);

    // Assert
    expect(result).toBe("Voucher");
  });
});
