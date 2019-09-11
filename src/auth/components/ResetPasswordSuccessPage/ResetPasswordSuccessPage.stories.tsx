import { storiesOf } from "@storybook/react";
import React from "react";

import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import ResetPasswordSuccessPage from "./ResetPasswordSuccessPage";

storiesOf("Views / Authentication / Reset password success", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("default", () => <ResetPasswordSuccessPage onBack={() => undefined} />);
