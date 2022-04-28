import { channelsList } from "@saleor/channels/fixtures";
import { createChannelsData } from "@saleor/channels/utils";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import ChannelsAvailabilityDialog, {
  ChannelsAvailabilityDialogProps
} from "./ChannelsAvailabilityDialog";

const props: ChannelsAvailabilityDialogProps = {
  channels: createChannelsData(channelsList),
  confirmButtonState: "default",
  disabled: false,
  isSelected: () => undefined,
  onChange: () => undefined,
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
  title: "Channels",
  toggleAll: () => undefined
};

export default {
  title: "Generics / ChannelsAvailabilityDialog",
  decorators: [Decorator]
};

export const Default = () => <ChannelsAvailabilityDialog {...props} />;

Default.story = {
  name: "default"
};

export const WithText = () => (
  <ChannelsAvailabilityDialog {...props} contentType="order" />
);

WithText.story = {
  name: "with text"
};

export const Disabled = () => (
  <ChannelsAvailabilityDialog {...props} disabled={true} />
);

Disabled.story = {
  name: "disabled"
};
