import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { channelsList } from "../../fixtures";
import ChannelDeleteDialog, {
  ChannelDeleteDialogProps
} from "./ChannelDeleteDialog";

const props: ChannelDeleteDialogProps = {
  channelsChoices: channelsList.map(channel => ({
    label: channel.name,
    value: channel.id
  })),
  confirmButtonState: "default",
  hasChannelOrders: false,
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true
};

storiesOf("Views / Channels / Delete channel", module)
  .addDecorator(Decorator)
  .add("default", () => <ChannelDeleteDialog {...props} />)
  .add("with channel orders", () => (
    <ChannelDeleteDialog {...props} hasChannelOrders={true} />
  ));
