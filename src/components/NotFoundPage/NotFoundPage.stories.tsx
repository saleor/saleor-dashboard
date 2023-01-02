import NotFoundPage from "@saleor/components/NotFoundPage";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

storiesOf("Error / Not found", module)
  .addDecorator(Decorator)
  .add("default", () => <NotFoundPage onBack={() => undefined} />);
