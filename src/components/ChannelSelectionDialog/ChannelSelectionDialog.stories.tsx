import { channelsList } from "@saleor/channels/fixtures";
import { createChannelsData } from "@saleor/channels/utils";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import ChannelSelectionDialog, {
  ChannelSelectionDialogProps
} from "./ChannelSelectionDialog";

const props: ChannelSelectionDialogProps = {
  channels: createChannelsData(channelsList),
  confirmButtonState: "default",
  isSelected: () => undefined,
  onChange: () => undefined,
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
  title: "Select Channel"
};

storiesOf("Generics / Channel Selection Dialog", module)
  .addDecorator(Decorator)
  .add("default", () => <ChannelSelectionDialog {...props} />);
