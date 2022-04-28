import Decorator from "@saleor/storybook/Decorator";
import { mapNodeToChoice } from "@saleor/utils/maps";
import React from "react";

import { channelsList } from "../../fixtures";
import ChannelPickerDialog, {
  ChannelPickerDialogProps
} from "./ChannelPickerDialog";

const channelsChoices = mapNodeToChoice(channelsList);

const props: ChannelPickerDialogProps = {
  channelsChoices,
  confirmButtonState: "default",
  defaultChoice: channelsChoices[0]?.value,
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true
};

export default {
  title: "Views / Channels / Settings dialog",
  decorators: [Decorator]
};

export const Default = () => <ChannelPickerDialog {...props} />;

Default.story = {
  name: "default"
};
