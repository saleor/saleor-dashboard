import { productChannels } from "@saleor/channels/fixtures";
import { createChannelsDataFromProduct } from "@saleor/channels/utils";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import ChannelsAvailability, {
  ChannelsAvailabilityProps
} from "./ChannelsAvailability";

const props: ChannelsAvailabilityProps = {
  channels: createChannelsDataFromProduct(productChannels),
  channelsAvailabilityText: "Channels text",
  onChange: () => undefined,
  openModal: () => undefined
};

storiesOf("Generics / ChannelsAvailability", module)
  .addDecorator(Decorator)
  .add("default", () => <ChannelsAvailability {...props} />);
