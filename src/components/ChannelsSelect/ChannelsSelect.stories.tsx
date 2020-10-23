import { product as productFixture } from "@saleor/products/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

const product = productFixture("");
const channelChoices = product.channelListing.map(listing => ({
  label: listing.channel.name,
  value: listing.channel.id
}));

import ChannelsSelect, { ChannelsSelectProps } from "./ChannelsSelect";

const props: ChannelsSelectProps = {
  channelChoice: channelChoices[0].value,
  channelChoices,
  setChannelChoice: () => undefined
};

storiesOf("Generics / ChannelsSelect", module)
  .addDecorator(Decorator)
  .add("default", () => <ChannelsSelect {...props} />);
