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
  showStatus: true
};

storiesOf("Generics / ChannelsAvailabilityDropdown", module)
  .addDecorator(Decorator)
  .add("default", () => <ChannelsAvailabilityDropdown {...props} />);
