import { productChannels } from "@saleor/channels/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import ChannelsAvailabilityDropdown, {
  ChannelsAvailabilityDropdownProps
} from "./ChannelsAvailabilityDropdown";

const props: ChannelsAvailabilityDropdownProps = {
  allChannelsCount: 6,
  channels: productChannels,
  currentChannel: productChannels[0]
};

storiesOf("Generics / ChannelsAvailabilityDropdown", module)
  .addDecorator(Decorator)
  .add("default", () => <ChannelsAvailabilityDropdown {...props} />);
