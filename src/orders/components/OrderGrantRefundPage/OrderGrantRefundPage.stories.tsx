// @ts-strict-ignore
import placeholderImage from "@assets/images/placeholder60x60.png";
import { FulfillmentStatus } from "@dashboard/graphql";
import React from "react";

import OrderGrantRefundPage, {
  OrderGrantRefundPageProps,
} from "./OrderGrantRefundPage";

const props: OrderGrantRefundPageProps = {
  submitState: "default",
  order: {
    id: "T3JkZXI6MjRhNmU0NWUtYzQ3Ny00Y2QxLTlhMDAtNmUzNTdjMDNmYTgz",
    number: "20",
    lines: [
      {
        id: "T3JkZXJMaW5lOjkyNTNmM2ZkLTA4NzktNDk2NC05YjY3LWYwNGNkNzM2MjI2Yw==",
        thumbnail: {
          url: placeholderImage,
          __typename: "Image",
        },
        productName: "Code Division T-shirt",
        quantity: 2,
        quantityToFulfill: 2,
        variantName: "S",
        unitPrice: {
          gross: {
            amount: 2.5,
            currency: "USD",
            __typename: "Money",
          },
          __typename: "TaxedMoney",
        },
        __typename: "OrderLine",
      },
      {
        id: "T3JkZXJMaW5lOjIxOTM0YTBjLWQ2NGQtNDdlMS05ZTc4LTJmMjIyYzU5NjQ5ZA==",
        thumbnail: {
          url: placeholderImage,
          __typename: "Image",
        },
        productName: "Seaman Lager",
        quantity: 4,
        quantityToFulfill: 2,
        variantName: "98616712",
        unitPrice: {
          gross: {
            amount: 5,
            currency: "USD",
            __typename: "Money",
          },
          __typename: "TaxedMoney",
        },
        __typename: "OrderLine",
      },
      {
        id: "T3JkZXJMaW5lOmU0N2UyN2IyLTQzZWYtNGY5OS05ZTU0LTkyZmZkZWE5MmY4OA==",
        thumbnail: {
          url: placeholderImage,
          __typename: "Image",
        },
        productName: "Yellow Plimsolls",
        quantity: 2,
        quantityToFulfill: 0,
        variantName: "41",
        unitPrice: {
          gross: {
            amount: 2.5,
            currency: "USD",
            __typename: "Money",
          },
          __typename: "TaxedMoney",
        },
        __typename: "OrderLine",
      },
      {
        id: "T3JkZXJMaW5lOmZjOWU1YzFlLWFiMDItNDU5MS05YTRmLTA5YmJiN2U0NmZlMg==",
        thumbnail: {
          url: placeholderImage,
          __typename: "Image",
        },
        productName: "T-shirt",
        quantity: 4,
        quantityToFulfill: 3,
        variantName: "XXL",
        unitPrice: {
          gross: {
            amount: 5,
            currency: "USD",
            __typename: "Money",
          },
          __typename: "TaxedMoney",
        },
        __typename: "OrderLine",
      },
    ],
    fulfillments: [
      {
        id: "RnVsZmlsbG1lbnQ6MTQ=",
        fulfillmentOrder: 1,
        status: FulfillmentStatus.FULFILLED,
        lines: [
          {
            id: "RnVsZmlsbG1lbnRMaW5lOjIw",
            quantity: 1,
            orderLine: {
              id: "T3JkZXJMaW5lOjIxOTM0YTBjLWQ2NGQtNDdlMS05ZTc4LTJmMjIyYzU5NjQ5ZA==",
              thumbnail: {
                url: placeholderImage,
                __typename: "Image",
              },
              productName: "Seaman Lager",
              quantity: 4,
              quantityToFulfill: 2,
              variantName: "98616712",
              unitPrice: {
                gross: {
                  amount: 5,
                  currency: "USD",
                  __typename: "Money",
                },
                __typename: "TaxedMoney",
              },
              __typename: "OrderLine",
            },
            __typename: "FulfillmentLine",
          },
        ],
        __typename: "Fulfillment",
      },
      {
        id: "RnVsZmlsbG1lbnQ6MTU=",
        fulfillmentOrder: 2,
        status: FulfillmentStatus.REFUNDED,
        lines: [
          {
            id: "RnVsZmlsbG1lbnRMaW5lOjIx",
            quantity: 1,
            orderLine: {
              id: "T3JkZXJMaW5lOjIxOTM0YTBjLWQ2NGQtNDdlMS05ZTc4LTJmMjIyYzU5NjQ5ZA==",
              thumbnail: {
                url: placeholderImage,
                __typename: "Image",
              },
              productName: "Seaman Lager",
              quantity: 4,
              quantityToFulfill: 2,
              variantName: "98616712",
              unitPrice: {
                gross: {
                  amount: 5,
                  currency: "USD",
                  __typename: "Money",
                },
                __typename: "TaxedMoney",
              },
              __typename: "OrderLine",
            },
            __typename: "FulfillmentLine",
          },
        ],
        __typename: "Fulfillment",
      },
      {
        id: "RnVsZmlsbG1lbnQ6MTY=",
        fulfillmentOrder: 3,
        status: FulfillmentStatus.FULFILLED,
        lines: [
          {
            id: "RnVsZmlsbG1lbnRMaW5lOjIy",
            quantity: 2,
            orderLine: {
              id: "T3JkZXJMaW5lOmU0N2UyN2IyLTQzZWYtNGY5OS05ZTU0LTkyZmZkZWE5MmY4OA==",
              thumbnail: {
                url: placeholderImage,
                __typename: "Image",
              },
              productName: "Yellow Plimsolls",
              quantity: 2,
              quantityToFulfill: 0,
              variantName: "41",
              unitPrice: {
                gross: {
                  amount: 2.5,
                  currency: "USD",
                  __typename: "Money",
                },
                __typename: "TaxedMoney",
              },
              __typename: "OrderLine",
            },
            __typename: "FulfillmentLine",
          },
          {
            id: "RnVsZmlsbG1lbnRMaW5lOjIz",
            quantity: 1,
            orderLine: {
              id: "T3JkZXJMaW5lOmZjOWU1YzFlLWFiMDItNDU5MS05YTRmLTA5YmJiN2U0NmZlMg==",
              thumbnail: {
                url: placeholderImage,
                __typename: "Image",
              },
              productName: "T-shirt",
              quantity: 4,
              quantityToFulfill: 3,
              variantName: "XXL",
              unitPrice: {
                gross: {
                  amount: 5,
                  currency: "USD",
                  __typename: "Money",
                },
                __typename: "TaxedMoney",
              },
              __typename: "OrderLine",
            },
            __typename: "FulfillmentLine",
          },
        ],
        __typename: "Fulfillment",
      },
    ],
    grantedRefunds: [],
    shippingPrice: {
      gross: {
        amount: 85.23,
        currency: "USD",
        __typename: "Money",
      },
      __typename: "TaxedMoney",
    },
    total: {
      gross: {
        amount: 135.23,
        currency: "USD",
        __typename: "Money",
      },
      __typename: "TaxedMoney",
    },
    __typename: "Order",
  },
  loading: false,
  // eslint-disable-next-line no-console
  onSubmit: data => console.log("onSubmit", data),
};

export default {
  title: "Orders / Grant refund order",
};

export const GrantRefund = () => <OrderGrantRefundPage {...props} />;

export const Loading = () => (
  <OrderGrantRefundPage
    submitState="loading"
    order={null}
    loading={true}
    onSubmit={() => undefined}
  />
);
