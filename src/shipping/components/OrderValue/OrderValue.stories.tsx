import { createShippingChannelsFromRate } from "@saleor/channels/utils";
import { shippingZone } from "@saleor/shipping/fixtures";
import Decorator from "@saleor/storybook//Decorator";
import React from "react";

import OrderValue, { OrderValueProps } from "./OrderValue";

const props: OrderValueProps = {
  channels: createShippingChannelsFromRate(
    shippingZone.shippingMethods[0].channelListings
  ),
  disabled: false,
  errors: [],
  orderValueRestricted: true,
  onChange: () => undefined,
  onChannelsChange: () => undefined
};

export default {
  title: "Shipping / Order value rates",
  decorators: [Decorator]
};

export const Default = () => <OrderValue {...props} />;

Default.story = {
  name: "default"
};

export const Loading = () => <OrderValue {...props} disabled={true} />;

Loading.story = {
  name: "loading"
};
