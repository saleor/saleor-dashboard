import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { channelsList } from "../../fixtures";
import ChannelSettingsDialog, {
  ChannelSettingsDialogProps
} from "./ChannelSettingsDialog";

const channelsChoices = channelsList.map(channel => ({
  label: channel.name,
  value: channel.id
}));

const props: ChannelSettingsDialogProps = {
  channelsChoices,
  confirmButtonState: "default",
  defaultChoice: channelsChoices[0]?.value,
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true
};

storiesOf("Views / Channels / Settings dialog", module)
  .addDecorator(Decorator)
  .add("default", () => <ChannelSettingsDialog {...props} />);
