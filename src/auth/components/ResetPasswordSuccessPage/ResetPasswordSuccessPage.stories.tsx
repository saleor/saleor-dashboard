import React from "react";

import { CardDecorator } from "../../../../.storybook/decorators";
import ResetPasswordSuccessPage from "./ResetPasswordSuccessPage";

export default {
  title: "Authentication / Reset password success",
  decorators: [CardDecorator],
};

export const Default = () => (
  <ResetPasswordSuccessPage onBack={() => undefined} />
);
