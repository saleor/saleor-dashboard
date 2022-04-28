import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import PreviewPill from "./PreviewPill";

export default {
  title: "Component / Preview Pill",
  decorators: [Decorator]
};

export const Default = () => <PreviewPill />;

Default.story = {
  name: "default"
};
