import CardDecorator from "@dashboard/storybook/CardDecorator";
import Decorator from "@dashboard/storybook/Decorator";
import { formError } from "@dashboard/storybook/formError";
import { storiesOf } from "@storybook/react";
import React from "react";

import ResetPasswordPage, { ResetPasswordPageProps } from "./ResetPasswordPage";

const props: ResetPasswordPageProps = {
  disabled: false,
  error: undefined,
  onSubmit: () => undefined,
};
storiesOf("Authentication / Reset password", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("default", () => <ResetPasswordPage {...props} />)
  .add("loading", () => <ResetPasswordPage {...props} disabled={true} />)
  .add("error", () => <ResetPasswordPage {...props} error={formError("").message} />);
