import { createChannelsDataFromProduct } from "@saleor/channels/utils";
import { product } from "@saleor/products/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import ChannelsAvailability, {
  ChannelsAvailabilityProps
} from "./ChannelsAvailability";

const productChannels = createChannelsDataFromProduct(product(""));

const props: ChannelsAvailabilityProps = {
  allChannelsCount: 4,
  channelsList: productChannels.map(channel => ({
    id: channel.id,
    name: channel.name
  })),
  errors: [],
  onChange: () => undefined,
  openModal: () => undefined,
  selectedChannelsCount: 3
};

storiesOf("Generics / ChannelsAvailability", module)
  .addDecorator(Decorator)
  .add("default", () => <ChannelsAvailability {...props} />)
  .add("with onChange", () => (
    <ChannelsAvailability
      {...props}
      channelsList={undefined}
      channels={productChannels}
      channelsMessages={productChannels.reduce(
        (prevVal, currVal) => ({
          ...prevVal,
          [currVal.id]: {
            availableLabel: "Available",
            availableSecondLabel: "Will become available",
            hiddenSecondLabel: "Will become published"
          }
        }),
        {}
      )}
    />
  ));
