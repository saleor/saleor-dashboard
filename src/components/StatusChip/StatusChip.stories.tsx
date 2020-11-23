import Decorator from "@saleor/storybook/Decorator";
import { OrderStatusType } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import StatusChip from "./StatusChip";

storiesOf("Generics / Status Chip", module)
  .addDecorator(Decorator)
  .add("neutral", () => (
    <StatusChip label="label" type={OrderStatusType.neutral} />
  ))
  .add("error", () => <StatusChip label="label" type={OrderStatusType.error} />)
  .add("success", () => (
    <StatusChip label="label" type={OrderStatusType.success} />
  ))
  .add("alert", () => (
    <StatusChip label="label" type={OrderStatusType.alert} />
  ));
