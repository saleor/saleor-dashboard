import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import NotFoundPage from "./NotFoundPage";

storiesOf("Error / Not found", module)
  .addDecorator(Decorator)
  .add("default", () => <NotFoundPage onBack={() => undefined} />);
