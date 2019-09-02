import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "@saleor/storybook/Decorator";
import ResetPasswordSuccessPage from "./ResetPasswordSuccessPage";

storiesOf("Views / Authentication / Reset password success", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <ResetPasswordSuccessPage onSubmit={() => undefined} />
  ));
