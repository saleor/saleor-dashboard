import { channelsList } from "@saleor/channels/fixtures";
import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import DraftOrderChannelSectionCard, {
  DraftOrderChannelSectionCardProps
} from ".";

const channelsChoices = channelsList.map(channel => ({
  label: channel.name,
  value: channel.id
}));

const props: DraftOrderChannelSectionCardProps = {
  channelsChoices,
  disabled: false,
  onChange: () => undefined,
  selectedChoice: channelsChoices[0]
};

storiesOf("Orders / Draft order channel section", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("default", () => <DraftOrderChannelSectionCard {...props} />)
  .add("loading", () => (
    <DraftOrderChannelSectionCard
      {...props}
      selectedChoice={undefined}
      disabled={true}
    />
  ))
  .add("no channel selected", () => (
    <DraftOrderChannelSectionCard {...props} selectedChoice={null} />
  ));
