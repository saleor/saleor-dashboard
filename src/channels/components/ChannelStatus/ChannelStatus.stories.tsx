import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import ChannelStatus, { ChannelStatusProps } from "./ChannelStatus";

const props: ChannelStatusProps = {
  isActive: false
};

storiesOf("Views / Channels / Channel status", module)
  .addDecorator(Decorator)
  .add("inactive", () => <ChannelStatus {...props} />)
  .add("active", () => <ChannelStatus {...props} isActive={true} />);
