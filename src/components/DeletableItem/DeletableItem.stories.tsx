import CommonDecorator from "@saleor/storybook/Decorator";
import React from "react";

import DeletableItem from "./DeletableItem";

export default {
  title: "Generics / Deletable Item",
  decorators: [CommonDecorator]
};

export const Default = () => (
  <DeletableItem id="1" onDelete={() => undefined} />
);

Default.story = {
  name: "default"
};
