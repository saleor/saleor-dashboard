import Decorator from "@saleor/storybook//Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import OrderValue, { OrderValueProps } from "./OrderValue";

const channels = [
  { id: "1", maxValue: 10, minValue: 0, name: "channel", price: 5 },
  { id: "2", maxValue: 20, minValue: 0, name: "test", price: 6 }
];

const props: OrderValueProps = {
  channels,
  disabled: false,
  noLimits: false,
  onChange: () => undefined,
  onChannelsChange: () => undefined
};

storiesOf("Shipping / Order value rates", module)
  .addDecorator(Decorator)
  .add("default", () => <OrderValue {...props} />)
  .add("loading", () => <OrderValue {...props} disabled={true} />);
