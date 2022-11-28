import placeholderImage from "@assets/images/placeholder60x60.png";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { order as getOrder, prepareMoney } from "../../fixtures";
import OrderSendRefund, { OrderSendRefundPageProps } from "./OrderSendRefund";

const order = getOrder(placeholderImage);

const props: OrderSendRefundPageProps = {
  order,
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
        ...order,
        totalGrantedRefund: prepareMoney(10),
        totalRemainingGrant: prepareMoney(10),
      }}
    />
  ))
  .add("loading", () => <OrderSendRefund {...props} loading={true} />);
