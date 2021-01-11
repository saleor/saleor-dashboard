import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import Accordion from "./Accordion";

storiesOf("Generics / Accordion", module)
  .addDecorator(Decorator)
  .addDecorator(CardDecorator)
  .add("default", () => <Accordion title="Title">Content</Accordion>)
  .add("opened", () => (
    <Accordion title="Title" initialExpand={true}>
      Content
    </Accordion>
  ))
  .add("with quick peek", () => (
    <Accordion title="Title" quickPeek="Quick Peek">
      Content
    </Accordion>
  ));
