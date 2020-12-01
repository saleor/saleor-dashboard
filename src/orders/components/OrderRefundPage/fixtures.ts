/* eslint-disable sort-keys */

import { OrderRefundData_order } from "@saleor/orders/types/OrderRefundData";
import { FulfillmentStatus } from "@saleor/types/globalTypes";

export const orderToRefund = (placeholder: string): OrderRefundData_order => ({
  __typename: "Order",
  id: "ifgdfuhdfdf",
  number: "22",
  total: {
    __typename: "TaxedMoney",
    gross: {
      __typename: "Money",
      amount: 744.38,
      currency: "USD"
    }
  },
  totalCaptured: {
    __typename: "Money",
    amount: 644.38,
    currency: "USD"
  },
  shippingPrice: {
    __typename: "TaxedMoney",
    gross: {
      __typename: "Money",
      amount: 20,
      currency: "USD"
    }
  },
  lines: [
    {
      __typename: "OrderLine",
      id: "diufhdsif",
      productName: "Milk",
      quantity: 19,
      quantityFulfilled: 3,
      thumbnail: {
        __typename: "Image",
        url: placeholder
      },
      unitPrice: {
        __typename: "TaxedMoney",
        gross: {
          __typename: "Money",
          amount: 26.02,
          currency: "USD"
        }
      }
    },
    {
      __typename: "OrderLine",
      id: "fdsfdfdsf",
      productName: "Coffee",
      quantity: 13,
      quantityFulfilled: 5,
      thumbnail: {
        __typename: "Image",
        url: placeholder
      },
      unitPrice: {
        __typename: "TaxedMoney",
        gross: {
          __typename: "Money",
          amount: 10,
          currency: "USD"
        }
      }
    }
  ],
  fulfillments: [
    {
      __typename: "Fulfillment",
      id: "f12345qwertyu",
      status: FulfillmentStatus.FULFILLED,
      fulfillmentOrder: 1,
      lines: [
        {
          __typename: "FulfillmentLine",
          id: "fg3333fu66666",
          quantity: 1,
          orderLine: {
            __typename: "OrderLine",
            id: "diufhdsif",
            productName: "Milk",
            quantity: 1,
            thumbnail: {
              __typename: "Image",
              url: placeholder
            },
            unitPrice: {
              __typename: "TaxedMoney",
              gross: {
                __typename: "Money",
                amount: 26.02,
                currency: "USD"
              }
            }
          }
        },
        {
          __typename: "FulfillmentLine",
          id: "fgytrytytu88977",
          quantity: 1,
          orderLine: {
            __typename: "OrderLine",
            id: "fdsfdfdsf",
            productName: "Coffee",
            quantity: 1,
            thumbnail: {
              __typename: "Image",
              url: placeholder
            },
            unitPrice: {
              __typename: "TaxedMoney",
              gross: {
                __typename: "Money",
                amount: 10,
                currency: "USD"
              }
            }
          }
        }
      ]
    },
    {
      __typename: "Fulfillment",
      id: "876543jhgfdfd",
      status: FulfillmentStatus.FULFILLED,
      fulfillmentOrder: 2,
      lines: [
        {
          __typename: "FulfillmentLine",
          id: "fgydgsyfu23456",
          quantity: 2,
          orderLine: {
            __typename: "OrderLine",
            id: "diufhdsif",
            productName: "Milk",
            quantity: 2,
            thumbnail: {
              __typename: "Image",
              url: placeholder
            },
            unitPrice: {
              __typename: "TaxedMoney",
              gross: {
                __typename: "Money",
                amount: 26.02,
                currency: "USD"
              }
            }
          }
        },
        {
          __typename: "FulfillmentLine",
          id: "fgydgsyfu555444",
          quantity: 4,
          orderLine: {
            __typename: "OrderLine",
            id: "fdsfdfdsf",
            productName: "Coffee",
            quantity: 4,
            thumbnail: {
              __typename: "Image",
              url: placeholder
            },
            unitPrice: {
              __typename: "TaxedMoney",
              gross: {
                __typename: "Money",
                amount: 10,
                currency: "USD"
              }
            }
          }
        }
      ]
    }
  ]
});
