import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import PreviewPill from "./PreviewPill";

storiesOf("Component / Preview Pill", module)
  .addDecorator(Decorator)
  .add("default", () => <PreviewPill />);
