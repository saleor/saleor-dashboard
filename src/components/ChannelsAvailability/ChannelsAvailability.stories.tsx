import { createChannelsDataFromProduct } from "@saleor/channels/utils";
import { product } from "@saleor/products/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import ChannelsAvailability, {
  ChannelsAvailabilityProps
} from "./ChannelsAvailability";

const props: ChannelsAvailabilityProps = {
  allChannelsCount: 4,
  channels: createChannelsDataFromProduct(product("")),
  onChange: () => undefined,
  openModal: () => undefined,
  selectedChannelsCount: 3
};

storiesOf("Generics / ChannelsAvailability", module)
  .addDecorator(Decorator)
  .add("default", () => <ChannelsAvailability {...props} />);
