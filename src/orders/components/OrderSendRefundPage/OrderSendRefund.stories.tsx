import placeholderImage from "@assets/images/placeholder60x60.png";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { order as getOrder, prepareMoney } from "../../fixtures";
import OrderSendRefund from "./OrderSendRefund";

const order = getOrder(placeholderImage);

storiesOf("Views / Orders / Send refund order", module)
  .addDecorator(Decorator)
  .add("settled", () => <OrderSendRefund order={order} />)
  .add("unsettled", () => (
    <OrderSendRefund
      order={{
        ...order,
        totalGrantedRefund: prepareMoney(10),
        totalRemainingGrant: prepareMoney(10),
      }}
    />
  ));
