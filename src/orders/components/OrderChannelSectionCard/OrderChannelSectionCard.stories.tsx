import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import OrderChannelSectionCard, { OrderChannelSectionCardProps } from ".";

const props: OrderChannelSectionCardProps = {
  selectedChannelName: "International store"
};

export default {
  title: "Orders / Order details channel section",
  decorators: [CardDecorator, Decorator]
};

export const Default = () => <OrderChannelSectionCard {...props} />;

Default.story = {
  name: "default"
};

export const Loading = () => (
  <OrderChannelSectionCard {...props} selectedChannelName={undefined} />
);

Loading.story = {
  name: "loading"
};
