import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import OrderChannelSectionCard, { OrderChannelSectionCardProps } from "./";

const props: OrderChannelSectionCardProps = {
  disabled: false,
  onSelectClick: () => undefined,
  selectedChannelName: "International store"
};

storiesOf("Orders / Draft order channel section", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("default", () => <OrderChannelSectionCard {...props} />)
  .add("loading", () => (
    <OrderChannelSectionCard
      {...props}
      selectedChannelName={undefined}
      disabled={true}
    />
  ))
  .add("no channel secected", () => (
    <OrderChannelSectionCard {...props} selectedChannelName={null} />
  ));
