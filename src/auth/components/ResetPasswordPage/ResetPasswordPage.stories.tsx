import { SubmitPromise } from "@dashboard/hooks/useForm";
import React from "react";

import { CardDecorator } from "../../../../.storybook/decorators";
import { formError } from "../../../../.storybook/helpers";
import ResetPasswordPage, { ResetPasswordPageProps } from "./ResetPasswordPage";

const dummyPromise = () => undefined as unknown as SubmitPromise;

const props: ResetPasswordPageProps = {
  disabled: false,
  error: "",
  onSubmit: dummyPromise,
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
