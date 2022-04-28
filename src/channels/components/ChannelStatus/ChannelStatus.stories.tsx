import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import ChannelStatus, { ChannelStatusProps } from "./ChannelStatus";

const props: ChannelStatusProps = {
  disabled: false,
  isActive: false,
  updateChannelStatus: () => undefined
};

export default {
  title: "Views / Channels / Channel status",
  decorators: [Decorator]
};

export const Inactive = () => <ChannelStatus {...props} />;

Inactive.story = {
  name: "inactive"
};

export const Active = () => <ChannelStatus {...props} isActive={true} />;

Active.story = {
  name: "active"
};
