/* eslint-disable sort-keys */
import { FormsetData } from "@saleor/hooks/useFormset";
import { FulfillmentStatus } from "@saleor/types/globalTypes";

import { OrderDetails_order_fulfillments_lines } from "../types/OrderDetails";
import {
  OrderRefundData_order_fulfillments,
  OrderRefundData_order_lines
} from "../types/OrderRefundData";
import {
  getAllFulfillmentLinesPriceSum,
  getPreviouslyRefundedPrice,
  getRefundedLinesPriceSum,
  mergeRepeatedOrderLines,
  OrderWithTotalAndTotalCaptured
} from "./data";

describe("Get previously refunded price", () => {
  it("is able to calculate refunded price from order", () => {
    const order: OrderWithTotalAndTotalCaptured = {
      total: {
        __typename: "TaxedMoney",
        gross: {
          __typename: "Money",
          amount: 160,
          currency: "USD"
        }
      },
      totalCaptured: {
        __typename: "Money",
        amount: 100,
        currency: "USD"
      }
    };

    const refundedPrice = getPreviouslyRefundedPrice(order);

    expect(refundedPrice.amount).toBe(-60);
  });
});

describe("Get refunded lines price sum", () => {
  const lines: OrderRefundData_order_lines[] = [
    {
      __typename: "OrderLine",
      id: "1",
      productName: "Milk 1",
      quantity: 1,
      quantityFulfilled: 1,
      thumbnail: undefined,
      unitPrice: {
        __typename: "TaxedMoney",
        gross: {
          __typename: "Money",
          amount: 10,
          currency: "USD"
        }
      }
    },
    {
      __typename: "OrderLine",
      id: "2",
      productName: "Milk 2",
      quantity: 2,
      quantityFulfilled: 2,
      thumbnail: undefined,
      unitPrice: {
        __typename: "TaxedMoney",
        gross: {
          __typename: "Money",
          amount: 6,
          currency: "USD"
        }
      }
    },
    {
      __typename: "OrderLine",
      id: "3",
      productName: "Milk 3",
      quantity: 4,
      quantityFulfilled: 4,
      thumbnail: undefined,
      unitPrice: {
        __typename: "TaxedMoney",
        gross: {
          __typename: "Money",
          amount: 4,
          currency: "USD"
        }
      }
    }
  ];

  it("is able to sum lines prices", () => {
    const refundedProductQuantities: FormsetData<null, string> = [
      {
        data: null,
        id: "1",
        label: null,
        value: "1"
      },
      {
        data: null,
        id: "2",
        label: null,
        value: "1"
      },
      {
        data: null,
        id: "3",
        label: null,
        value: "1"
      }
    ];

    const refundedLinesPriceSum = getRefundedLinesPriceSum(
      lines,
      refundedProductQuantities
    );

    expect(refundedLinesPriceSum).toBe(20);
  });

  it("is able to sum lines prices multiplied by different quantities", () => {
    const refundedProductQuantities: FormsetData<null, string> = [
      {
        data: null,
        id: "1",
        label: null,
        value: "0"
      },
      {
        data: null,
        id: "2",
        label: null,
        value: "2"
      },
      {
        data: null,
        id: "3",
        label: null,
        value: "4"
      }
    ];

    const refundedLinesPriceSum = getRefundedLinesPriceSum(
      lines,
      refundedProductQuantities
    );

    expect(refundedLinesPriceSum).toBe(28);
  });
});

describe("Get get all fulfillment lines price sum", () => {
  const fulfillments: OrderRefundData_order_fulfillments[] = [
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
                currency: "USD"
              }
            }
          },
          quantity: 1
        }
      ],
      status: FulfillmentStatus.FULFILLED
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
                currency: "USD"
              }
            }
          },
          quantity: 1
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
                currency: "USD"
              }
            }
          },
          quantity: 1
        }
      ],
      status: FulfillmentStatus.FULFILLED
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
                currency: "USD"
              }
            }
          },
          quantity: 1
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
                currency: "USD"
              }
            }
          },
          quantity: 1
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
                currency: "USD"
              }
            }
          },
          quantity: 1
        }
      ],
      status: FulfillmentStatus.FULFILLED
    }
  ];

  it("is able to sum fulfillment lines prices", () => {
    const refundedFulfilledProductQuantities: FormsetData<null, string> = [
      {
        data: null,
        id: "1-fulfillment-1",
        label: null,
        value: "1"
      },
      {
        data: null,
        id: "2-fulfillment-1",
        label: null,
        value: "1"
      },
      {
        data: null,
        id: "2-fulfillment-2",
        label: null,
        value: "1"
      },
      {
        data: null,
        id: "3-fulfillment-1",
        label: null,
        value: "1"
      },
      {
        data: null,
        id: "3-fulfillment-2",
        label: null,
        value: "1"
      },
      {
        data: null,
        id: "3-fulfillment-3",
        label: null,
        value: "1"
      }
    ];

    const allFulfillmentLinesPriceSum = getAllFulfillmentLinesPriceSum(
      fulfillments,
      refundedFulfilledProductQuantities
    );

    expect(allFulfillmentLinesPriceSum).toBe(34);
  });

  it("is able to sum fulfillment lines prices multiplied by different quantities", () => {
    const refundedFulfilledProductQuantities: FormsetData<null, string> = [
      {
        data: null,
        id: "1-fulfillment-1",
        label: null,
        value: "0"
      },
      {
        data: null,
        id: "2-fulfillment-1",
        label: null,
        value: "2"
      },
      {
        data: null,
        id: "2-fulfillment-2",
        label: null,
        value: "2"
      },
      {
        data: null,
        id: "3-fulfillment-1",
        label: null,
        value: "4"
      },
      {
        data: null,
        id: "3-fulfillment-2",
        label: null,
        value: "4"
      },
      {
        data: null,
        id: "3-fulfillment-3",
        label: null,
        value: "4"
      }
    ];

    const allFulfillmentLinesPriceSum = getAllFulfillmentLinesPriceSum(
      fulfillments,
      refundedFulfilledProductQuantities
    );

    expect(allFulfillmentLinesPriceSum).toBe(72);
  });
});

describe("Merge repeated order lines of fulfillment lines", () => {
  it("is able to merge repeated order lines and sum their quantities", () => {
    const lines: OrderDetails_order_fulfillments_lines[] = [
      {
        id: "RnVsZmlsbG1lbnRMaW5lOjMx",
        quantity: 1,
        orderLine: {
          id: "T3JkZXJMaW5lOjQ1",
          isShippingRequired: false,
          variant: {
            id: "UHJvZHVjdFZhcmlhbnQ6MzE3",
            quantityAvailable: 50,
            __typename: "ProductVariant"
          },
          productName: "Lake Tunes",
          productSku: "lake-tunes-mp3",
          quantity: 2,
          quantityFulfilled: 2,
          unitPrice: {
            gross: {
              amount: 9.99,
              currency: "USD",
              __typename: "Money"
            },
            net: {
              amount: 9.99,
              currency: "USD",
              __typename: "Money"
            },
            __typename: "TaxedMoney"
          },
          thumbnail: {
            url:
              "http://localhost:8000/media/__sized__/products/saleor-digital-03_2-thumbnail-255x255.png",
            __typename: "Image"
          },
          __typename: "OrderLine"
        },
        __typename: "FulfillmentLine"
      },
      {
        id: "RnVsZmlsbG1lbnRMaW5lOjMy",
        quantity: 1,
        orderLine: {
          id: "T3JkZXJMaW5lOjQ1",
          isShippingRequired: false,
          variant: {
            id: "UHJvZHVjdFZhcmlhbnQ6MzE3",
            quantityAvailable: 50,
            __typename: "ProductVariant"
          },
          productName: "Lake Tunes",
          productSku: "lake-tunes-mp3",
          quantity: 2,
          quantityFulfilled: 2,
          unitPrice: {
            gross: {
              amount: 9.99,
              currency: "USD",
              __typename: "Money"
            },
            net: {
              amount: 9.99,
              currency: "USD",
              __typename: "Money"
            },
            __typename: "TaxedMoney"
          },
          thumbnail: {
            url:
              "http://localhost:8000/media/__sized__/products/saleor-digital-03_2-thumbnail-255x255.png",
            __typename: "Image"
          },
          __typename: "OrderLine"
        },
        __typename: "FulfillmentLine"
      },
      {
        id: "RnVsZmlsbG1lbnRMaW5lOjMz",
        quantity: 1,
        orderLine: {
          id: "T3JkZXJMaW5lOjQ3",
          isShippingRequired: true,
          variant: {
            id: "UHJvZHVjdFZhcmlhbnQ6Mjg2",
            quantityAvailable: 50,
            __typename: "ProductVariant"
          },
          productName: "T-shirt",
          productSku: "29810068",
          quantity: 3,
          quantityFulfilled: 1,
          unitPrice: {
            gross: {
              amount: 2.5,
              currency: "USD",
              __typename: "Money"
            },
            net: {
              amount: 2.5,
              currency: "USD",
              __typename: "Money"
            },
            __typename: "TaxedMoney"
          },
          thumbnail: {
            url:
              "http://localhost:8000/media/__sized__/products/saleordemoproduct_cl_boot06_1-thumbnail-255x255.png",
            __typename: "Image"
          },
          __typename: "OrderLine"
        },
        __typename: "FulfillmentLine"
      }
    ];

    const mergedLines = mergeRepeatedOrderLines(lines);

    expect(mergedLines).toHaveLength(2);
    expect(
      mergedLines.find(
        fulfillmentLine => fulfillmentLine.orderLine.id === "T3JkZXJMaW5lOjQ1"
      ).quantity
    ).toBe(2);
  });
});
