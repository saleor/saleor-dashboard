import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import LoginLoading from ".";

export default {
  title: "Views / Authentication / Verifying remembered user",
  decorators: [Decorator]
};

export const Default = () => <LoginLoading />;

Default.story = {
  name: "default"
};
