import placeholderImage from "@assets/images/placeholder60x60.png";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { orderToRefund } from "./fixtures";
import { OrderRefundType } from "./form";
import OrderRefundPage, { OrderRefundPageProps } from "./OrderRefundPage";

const props: OrderRefundPageProps = {
  disabled: false,
  errors: [],
  onBack: () => undefined,
  onSubmit: () => undefined,
  order: orderToRefund(placeholderImage)
};

storiesOf("Views / Orders / Refund order", module)
  .addDecorator(Decorator)
  .add("products", () => (
    <OrderRefundPage {...props} defaultType={OrderRefundType.PRODUCTS} />
  ))
  .add("miscellaneous", () => (
    <OrderRefundPage {...props} defaultType={OrderRefundType.MISCELLANEOUS} />
  ))
  .add("loading", () => (
    <OrderRefundPage {...props} disabled={true} order={undefined} />
  ));
