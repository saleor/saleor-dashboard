import Decorator from "@saleor/storybook/Decorator";
import { mapNodeToChoice } from "@saleor/utils/maps";
import { storiesOf } from "@storybook/react";
import React from "react";

import { channelsList } from "../../fixtures";
import ChannelPickerDialog, {
  ChannelPickerDialogProps,
} from "./ChannelPickerDialog";

const channelsChoices = mapNodeToChoice(channelsList);

const props: ChannelPickerDialogProps = {
  channelsChoices,
  confirmButtonState: "default",
  defaultChoice: channelsChoices[0]?.value,
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
};

storiesOf("Views / Channels / Settings dialog", module)
  .addDecorator(Decorator)
  .add("default", () => <ChannelPickerDialog {...props} />);
