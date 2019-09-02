import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "@saleor/storybook//Decorator";
import ResetPasswordPage from "./ResetPasswordPage";

storiesOf("Views / Authentication / Reset password", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <ResetPasswordPage disabled={false} onSubmit={() => undefined} />
  ))
  .add("loading", () => (
    <ResetPasswordPage disabled={true} onSubmit={() => undefined} />
  ));
