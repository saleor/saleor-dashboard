import Decorator from "@dashboard/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { orderWithTransactions, prepareMoney } from "../../fixtures";
import OrderSendRefund, { OrderSendRefundPageProps } from "./OrderSendRefund";

const props: OrderSendRefundPageProps = {
  order: orderWithTransactions,
  loading: false,
  onAddManualRefund: () => undefined,
  addManualRefundState: "default",
  addManualRefundError: undefined,
};

storiesOf("Views / Orders / Send refund order", module)
  .addDecorator(Decorator)
  .add("settled", () => <OrderSendRefund {...props} />)
  .add("unsettled", () => (
    <OrderSendRefund
      {...props}
      order={{
        ...orderWithTransactions,
        totalGrantedRefund: prepareMoney(10),
        totalRemainingGrant: prepareMoney(10),
      }}
    />
  ))
  .add("loading", () => (
    <OrderSendRefund {...props} order={null} loading={true} />
  ));
