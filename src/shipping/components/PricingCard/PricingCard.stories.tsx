import Decorator from "@saleor/storybook//Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import PricingCard, { PricingCardProps } from "./PricingCard";

const channels = [
  { id: "1", maxValue: 10, minValue: 0, name: "channel", price: 5 },
  { id: "2", maxValue: 20, minValue: 0, name: "test", price: 6 }
];

const props: PricingCardProps = {
  channels,
  defaultCurrency: "USD",
  disabled: false,
  onChange: () => undefined
};

storiesOf("Shipping / Pricing Card", module)
  .addDecorator(Decorator)
  .add("default", () => <PricingCard {...props} />)
  .add("loading", () => <PricingCard {...props} disabled={true} />);
