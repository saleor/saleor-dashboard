import { createChannelsDataFromProduct } from "@saleor/channels/utils";
import { product } from "@saleor/products/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

const productChannels = createChannelsDataFromProduct(product(""));

import AvailabilityCard from "./AvailabilityCard";
const props = {
  allChannelsCount: 4,
  channels: productChannels,
  errors: [],
  messages: {
    hiddenLabel: "Not published",
    hiddenSecondLabel: "hidden label",
    visibleLabel: "Published"
  },
  onChange: () => undefined,
  openModal: () => undefined,
  selectedChannelsCount: 3
};

storiesOf("Generics / AvailabilityCard", module)
  .addDecorator(Decorator)
  .add("default", () => <AvailabilityCard {...props} />);
