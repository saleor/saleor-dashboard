import CentralPlacementDecorator from "@saleor/storybook/CentralPlacementDecorator";
import CommonDecorator from "@saleor/storybook/Decorator";
import React from "react";

import CannotDefineChannelsAvailabilityCard from "./CannotDefineChannelsAvailabilityCard";

export default {
  title: "Channels / Cannot define channels availability card",
  decorators: [CommonDecorator, CentralPlacementDecorator]
};

export const Default = () => <CannotDefineChannelsAvailabilityCard />;

Default.story = {
  name: "default"
};
