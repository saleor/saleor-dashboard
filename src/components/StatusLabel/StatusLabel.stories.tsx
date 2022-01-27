import StatusLabel from "@saleor/components/StatusLabel";
import { storiesOf } from "@storybook/react";
import React from "react";

import CardDecorator from "../../storybook/CardDecorator";
import Decorator from "../../storybook/Decorator";

storiesOf("Generics / StatusLabel", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("when success", () => (
    <StatusLabel label="Example label" status="success" />
  ))
  .add("when info", () => <StatusLabel label="Example label" status="info" />)
  .add("when error", () => (
    <StatusLabel label="Example label" status="error" />
  ));
