import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import OrderChannelSectionCard, { OrderChannelSectionCardProps } from ".";

const props: OrderChannelSectionCardProps = {
  channel: {
    id: "dh87hf34hk8i",
    name: "International store",
  },
};

storiesOf("Orders / Order details channel section", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("default", () => <OrderChannelSectionCard {...props} />)
  .add("loading", () => (
    <OrderChannelSectionCard {...props} channel={undefined} />
  ));
