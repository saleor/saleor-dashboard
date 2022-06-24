import { channelsList } from "@saleor/channels/fixtures";
import { createChannelsData } from "@saleor/channels/utils";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import ChannelsAvailabilityDialog, {
  ChannelsAvailabilityDialogProps,
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
  toggleAll: () => undefined,
};

storiesOf("Generics / ChannelsAvailabilityDialog", module)
  .addDecorator(Decorator)
  .add("default", () => <ChannelsAvailabilityDialog {...props} />)
  .add("with text", () => (
    <ChannelsAvailabilityDialog {...props} contentType="order" />
  ))
  .add("disabled", () => (
    <ChannelsAvailabilityDialog {...props} disabled={true} />
  ));
