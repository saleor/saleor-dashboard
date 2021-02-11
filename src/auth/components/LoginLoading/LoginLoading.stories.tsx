import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import LoginLoading from ".";

storiesOf("Views / Authentication / Verifying remembered user", module)
  .addDecorator(Decorator)
  .add("default", () => <LoginLoading />);
