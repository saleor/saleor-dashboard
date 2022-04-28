import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import { formError } from "@saleor/storybook/misc";
import React from "react";

import ResetPasswordPage, { ResetPasswordPageProps } from "./ResetPasswordPage";

const props: ResetPasswordPageProps = {
  disabled: false,
  error: undefined,
  onBack: () => undefined,
  onSubmit: () => undefined
};

export default {
  title: "Views / Authentication / Reset password",
  decorators: [CardDecorator, Decorator]
};

export const Default = () => <ResetPasswordPage {...props} />;

Default.story = {
  name: "default"
};

export const Loading = () => <ResetPasswordPage {...props} disabled={true} />;

Loading.story = {
  name: "loading"
};

export const Error = () => (
  <ResetPasswordPage {...props} error={formError("").message} />
);

Error.story = {
  name: "error"
};
