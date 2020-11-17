import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import DraftOrderChannelSectionCard, {
  DraftOrderChannelSectionCardProps
} from ".";

const props: DraftOrderChannelSectionCardProps = {
  channelName: "Default Channel"
};

storiesOf("Orders / Draft order channel section", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("default", () => <DraftOrderChannelSectionCard {...props} />)
  .add("loading", () => (
    <DraftOrderChannelSectionCard {...props} channelName={undefined} />
  ));
