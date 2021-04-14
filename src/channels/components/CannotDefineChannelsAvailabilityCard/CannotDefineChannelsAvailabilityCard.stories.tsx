import CentralPlacementDecorator from "@saleor/storybook/CentralPlacementDecorator";
import CommonDecorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import CannotDefineChannelsAvailabilityCard from "./CannotDefineChannelsAvailabilityCard";

storiesOf("Channels / Cannot define channels availability card", module)
  .addDecorator(CommonDecorator)
  .addDecorator(CentralPlacementDecorator)
  .add("default", () => <CannotDefineChannelsAvailabilityCard />);
