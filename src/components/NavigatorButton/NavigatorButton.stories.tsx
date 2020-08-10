import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import NavigatorButton from "./NavigatorButton";

storiesOf("Generics / NavigatorButton", module)
  .addDecorator(Decorator)
  .addDecorator(CardDecorator)
  .add("mac", () => <NavigatorButton isMac={true} />)
  .add("other", () => <NavigatorButton isMac={false} />);
