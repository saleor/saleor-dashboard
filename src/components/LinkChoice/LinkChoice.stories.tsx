import { countries } from "@saleor/fixtures";
import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import Form from "../Form";
import LinkChoice, { LinkChoiceProps } from "./LinkChoice";

const suggestions = countries.map(c => ({ label: c.name, value: c.code }));

const props: Omit<LinkChoiceProps, "value" | "onChange"> = {
  choices: suggestions.slice(0, 10),
  name: "country"
};

export default {
  title: "Generics / Link with choices",
  decorators: [CardDecorator, Decorator]
};

export const Default = () => (
  <Form initial={{ country: suggestions[1].value }}>
    {({ change, data }) => (
      <LinkChoice {...props} value={data.country} onChange={change} />
    )}
  </Form>
);

Default.story = {
  name: "default"
};
