import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import StatusChip from "./StatusChip";
import { StatusType } from "./types";

storiesOf("Generics / Status Chip", module)
  .addDecorator(Decorator)
  .add("neutral", () => <StatusChip label="label" type={StatusType.INFO} />)
  .add("error", () => <StatusChip label="label" type={StatusType.ERROR} />)
  .add("success", () => <StatusChip label="label" type={StatusType.SUCCESS} />)
  .add("alert", () => <StatusChip label="label" type={StatusType.WARNING} />);
