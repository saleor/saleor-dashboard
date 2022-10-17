import placeholderImage from "@assets/images/placeholder60x60.png";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { order as getOrder } from "../../fixtures";
import OrderRefundPage, { OrderRefundPageProps } from "./OrderRefundPage";

const props: OrderRefundPageProps = {
  order: getOrder(placeholderImage),
};

storiesOf("Views / Orders / Refund order 2", module)
  .addDecorator(Decorator)
  .add("refund", () => <OrderRefundPage {...props} />);
