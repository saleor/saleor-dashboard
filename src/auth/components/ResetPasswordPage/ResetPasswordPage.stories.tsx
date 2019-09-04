import { storiesOf } from "@storybook/react";
import React from "react";

import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import { formError } from "@saleor/storybook/misc";
import ResetPasswordPage, { ResetPasswordPageProps } from "./ResetPasswordPage";

const props: ResetPasswordPageProps = {
  disabled: false,
  error: undefined,
  onSubmit: () => undefined
};
storiesOf("Views / Authentication / Reset password", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("default", () => <ResetPasswordPage {...props} />)
  .add("loading", () => <ResetPasswordPage {...props} disabled={true} />)
  .add("error", () => (
    <ResetPasswordPage {...props} error={formError("").message} />
  ));
