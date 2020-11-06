import { createShippingChannelsFromRate } from "@saleor/channels/utils";
import { shippingZone } from "@saleor/shipping/fixtures";
import Decorator from "@saleor/storybook//Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import OrderValue, { OrderValueProps } from "./OrderValue";

const props: OrderValueProps = {
  channels: createShippingChannelsFromRate(
    shippingZone.shippingMethods[0].channelListings
  ),
  disabled: false,
  errors: [],
  noLimits: false,
  onChange: () => undefined,
  onChannelsChange: () => undefined
};

storiesOf("Shipping / Order value rates", module)
  .addDecorator(Decorator)
  .add("default", () => <OrderValue {...props} />)
  .add("loading", () => <OrderValue {...props} disabled={true} />);
