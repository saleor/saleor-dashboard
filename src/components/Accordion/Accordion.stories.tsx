import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import Accordion from "./Accordion";

export default {
  title: "Generics / Accordion",
  decorators: [Decorator, CardDecorator]
};

export const Default = () => <Accordion title="Title">Content</Accordion>;

Default.story = {
  name: "default"
};

export const Opened = () => (
  <Accordion title="Title" initialExpand={true}>
    Content
  </Accordion>
);

Opened.story = {
  name: "opened"
};

export const WithQuickPeek = () => (
  <Accordion title="Title" quickPeek="Quick Peek">
    Content
  </Accordion>
);

WithQuickPeek.story = {
  name: "with quick peek"
};
