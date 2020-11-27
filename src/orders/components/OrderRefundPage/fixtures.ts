/* eslint-disable sort-keys */

import { OrderRefundData_order } from "@saleor/orders/types/OrderRefundData";

export const orderToRefund: OrderRefundData_order = {
  __typename: "Order",
  id: "ifgdfuhdfdf",
  number: "22",
  total: {
    __typename: "TaxedMoney",
    gross: {
      __typename: "Money",
      amount: 260.2,
      currency: "USD"
    }
  },
  totalCaptured: {
    __typename: "Money",
    amount: 160.2,
    currency: "USD"
  }
};
