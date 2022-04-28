import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import NavigatorButton from "./NavigatorButton";

export default {
  title: "Generics / NavigatorButton",
  decorators: [Decorator, CardDecorator]
};

export const Mac = () => <NavigatorButton isMac={true} />;

Mac.story = {
  name: "mac"
};

export const Other = () => <NavigatorButton isMac={false} />;

Other.story = {
  name: "other"
};
