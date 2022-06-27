import { createShippingChannelsFromRate } from "@saleor/channels/utils";
import { shippingZone } from "@saleor/shipping/fixtures";
import Decorator from "@saleor/storybook//Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import PricingCard, { PricingCardProps } from "./PricingCard";

const props: PricingCardProps = {
  channels: createShippingChannelsFromRate(
    shippingZone.shippingMethods[0].channelListings,
  ),
  disabled: false,
  errors: [],
  onChange: () => undefined,
};

storiesOf("Shipping / Pricing Card", module)
  .addDecorator(Decorator)
  .add("default", () => <PricingCard {...props} />)
  .add("loading", () => <PricingCard {...props} disabled={true} />);
