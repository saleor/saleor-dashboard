import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import DraftOrderChannelSectionCard, {
  DraftOrderChannelSectionCardProps
} from ".";

const props: DraftOrderChannelSectionCardProps = {
  channelName: "Default Channel"
};

export default {
  title: "Orders / Draft order channel section",
  decorators: [CardDecorator, Decorator]
};

export const Default = () => <DraftOrderChannelSectionCard {...props} />;

Default.story = {
  name: "default"
};

export const Loading = () => (
  <DraftOrderChannelSectionCard {...props} channelName={undefined} />
);

Loading.story = {
  name: "loading"
};
