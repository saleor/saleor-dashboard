import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import Alert from "./Alert";

storiesOf("Generics / Alert", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <Alert show={true} title="Title">
      Content
    </Alert>
  ));
