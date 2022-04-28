import Decorator from "@saleor/storybook/Decorator";
import { mapNodeToChoice } from "@saleor/utils/maps";
import React from "react";

import { channelsList } from "../../fixtures";
import ChannelDeleteDialog, {
  ChannelDeleteDialogProps
} from "./ChannelDeleteDialog";

const props: ChannelDeleteDialogProps = {
  channelsChoices: mapNodeToChoice(channelsList),
  confirmButtonState: "default",
  hasOrders: true,
  onBack: () => undefined,
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true
};

export default {
  title: "Views / Channels / Delete channel",
  decorators: [Decorator]
};

export const Default = () => <ChannelDeleteDialog {...props} />;

Default.story = {
  name: "default"
};

export const WithoutChannelsToChoose = () => (
  <ChannelDeleteDialog {...props} channelsChoices={[]} />
);

WithoutChannelsToChoose.story = {
  name: "without channels to choose"
};
