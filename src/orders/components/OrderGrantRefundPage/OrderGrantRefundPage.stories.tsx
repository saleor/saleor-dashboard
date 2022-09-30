import placeholderImage from "@assets/images/placeholder60x60.png";
import {
  grantedRefunds,
  order as orderFixture,
  prepareMoney,
} from "@saleor/orders/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import OrderGrantRefundPage, {
  OrderGrantRefundPageProps,
} from "./OrderGrantRefundPage";

const order = orderFixture(placeholderImage);

const props: OrderGrantRefundPageProps = {
  order: {
    ...order,
    totalGrantedRefund: prepareMoney(),
    grantedRefunds,
  },
  loading: false,
  // eslint-disable-next-line no-console
  onSubmit: data => console.log("onSubmit", data),
};

storiesOf("Views / Orders / Grant refund order", module)
  .addDecorator(Decorator)
  .add("grant refund", () => <OrderGrantRefundPage {...props} />)
  .add("loading", () => (
    <OrderGrantRefundPage
      order={null}
      loading={true}
      onSubmit={() => undefined}
    />
  ));
