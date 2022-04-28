import { createShippingChannelsFromRate } from "@saleor/channels/utils";
import { shippingZone } from "@saleor/shipping/fixtures";
import Decorator from "@saleor/storybook//Decorator";
import React from "react";

import PricingCard, { PricingCardProps } from "./PricingCard";

const props: PricingCardProps = {
  channels: createShippingChannelsFromRate(
    shippingZone.shippingMethods[0].channelListings
  ),
  disabled: false,
  errors: [],
  onChange: () => undefined
};

export default {
  title: "Shipping / Pricing Card",
  decorators: [Decorator]
};

export const Default = () => <PricingCard {...props} />;

Default.story = {
  name: "default"
};

export const Loading = () => <PricingCard {...props} disabled={true} />;

Loading.story = {
  name: "loading"
};
