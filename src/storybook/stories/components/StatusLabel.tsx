import { StatusType } from "@saleor/components/StatusChip/types";
import StatusLabel from "@saleor/components/StatusLabel";
import { storiesOf } from "@storybook/react";
import React from "react";

import CardDecorator from "../../CardDecorator";
import Decorator from "../../Decorator";

storiesOf("Generics / StatusLabel", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("when success", () => (
    <StatusLabel label="Example label" status={StatusType.SUCCESS} />
  ))
  .add("when neutral", () => (
    <StatusLabel label="Example label" status={StatusType.NEUTRAL} />
  ))
  .add("when error", () => (
    <StatusLabel label="Example label" status={StatusType.ERROR} />
  ));
