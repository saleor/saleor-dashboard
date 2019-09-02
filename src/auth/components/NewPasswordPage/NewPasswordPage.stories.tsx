import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "@saleor/storybook//Decorator";
import NewPasswordPage from "./NewPasswordPage";

storiesOf("Views / Authentication / Set up a new password", module)
  .addDecorator(Decorator)
  .add("default", () => <NewPasswordPage onSubmit={() => undefined} />);
