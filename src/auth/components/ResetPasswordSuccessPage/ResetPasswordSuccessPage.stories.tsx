import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import ResetPasswordSuccessPage from "./ResetPasswordSuccessPage";

export default {
  title: "Views / Authentication / Reset password success",
  decorators: [CardDecorator, Decorator]
};

export const Default = () => (
  <ResetPasswordSuccessPage onBack={() => undefined} />
);

Default.story = {
  name: "default"
};
