// @ts-strict-ignore
import React from "react";

import { CardDecorator } from "../../../../.storybook/decorators";
import { formError } from "../../../../.storybook/helpers";
import ResetPasswordPage, { ResetPasswordPageProps } from "./ResetPasswordPage";

const props: ResetPasswordPageProps = {
  disabled: false,
  error: undefined,
  onSubmit: () => undefined,
};

export default {
  title: "Authentication / Reset password",
  decorators: [CardDecorator],
};

export const Default = () => <ResetPasswordPage {...props} />;

export const Loading = () => <ResetPasswordPage {...props} disabled={true} />;

export const Error = () => (
  <ResetPasswordPage {...props} error={formError("").message} />
);
