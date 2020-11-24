import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { orderToRefund } from "./fixtures";
import OrderRefundPage, { OrderRefundPageProps } from "./OrderRefundPage";

const props: OrderRefundPageProps = {
  disabled: false,
  errors: [],
  onBack: () => undefined,
  onSubmit: () => undefined,
  order: orderToRefund
};

storiesOf("Views / Orders / Refund order", module)
  .addDecorator(Decorator)
  .add("default", () => <OrderRefundPage {...props} />);
