// @ts-strict-ignore
import React from "react";

import { order as orderFixture, prepareMoney } from "../../fixtures";
import OrderSendRefund, { OrderSendRefundPageProps } from "./OrderSendRefund";

const props: OrderSendRefundPageProps = {
  order: orderFixture(null),
  loading: false,
  onAddManualRefund: () => undefined,
  addManualRefundState: "default",
  addManualRefundError: undefined,
};

export default {
  title: "Orders / Send refund order",
};

export const Settled = () => <OrderSendRefund {...props} />;

export const Unsettled = () => (
  <OrderSendRefund
    {...props}
    order={{
      ...orderFixture(null),
      totalGrantedRefund: prepareMoney(10),
      totalRemainingGrant: prepareMoney(10),
    }}
  />
);

export const Loading = () => (
  <OrderSendRefund {...props} order={null} loading={true} />
);
