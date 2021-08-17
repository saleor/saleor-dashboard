import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import StatusChip from "./StatusChip";
import { StatusType } from "./types";

storiesOf("Generics / Status Chip", module)
  .addDecorator(Decorator)
  .add("neutral", () => (
    <StatusChip label="label" status={StatusType.NEUTRAL} />
  ))
  .add("error", () => <StatusChip label="label" status={StatusType.ERROR} />)
  .add("success", () => (
    <StatusChip label="label" status={StatusType.SUCCESS} />
  ))
  .add("alert", () => <StatusChip label="label" status={StatusType.ALERT} />);
