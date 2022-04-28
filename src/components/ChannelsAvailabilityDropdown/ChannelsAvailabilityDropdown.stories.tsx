import { productChannels } from "@saleor/channels/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import ChannelsAvailabilityDropdown, {
  ChannelsAvailabilityDropdownProps
} from "./ChannelsAvailabilityDropdown";

const props: ChannelsAvailabilityDropdownProps = {
  channels: productChannels
};

export default {
  title: "Generics / ChannelsAvailabilityDropdown",
  decorators: [Decorator]
};

export const Default = () => <ChannelsAvailabilityDropdown {...props} />;

Default.story = {
  name: "default"
};
