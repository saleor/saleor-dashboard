import CommonDecorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import DeletableItem from "./DeletableItem";

storiesOf("Generics / Deletable Item", module)
  .addDecorator(CommonDecorator)
  .add("default", () => <DeletableItem id="1" onDelete={() => undefined} />);
