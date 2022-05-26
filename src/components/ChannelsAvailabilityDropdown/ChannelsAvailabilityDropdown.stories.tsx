import { productChannels } from "@saleor/channels/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import ChannelsAvailabilityDropdown, {
  ChannelsAvailabilityDropdownProps,
} from "./ChannelsAvailabilityDropdown";

const props: ChannelsAvailabilityDropdownProps = {
  channels: productChannels,
};

storiesOf("Generics / ChannelsAvailabilityDropdown", module)
  .addDecorator(Decorator)
  .add("default", () => <ChannelsAvailabilityDropdown {...props} />);
