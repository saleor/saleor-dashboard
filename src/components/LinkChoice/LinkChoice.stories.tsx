import { countries } from "@saleor/fixtures";
import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import Form from "../Form";
import LinkChoice, { LinkChoiceProps } from "./LinkChoice";

const suggestions = countries.map(c => ({ label: c.name, value: c.code }));

const props: Omit<LinkChoiceProps, "value" | "onChange"> = {
  choices: suggestions.slice(0, 10),
  name: "country",
};

storiesOf("Generics / Link with choices", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("default", () => (
    <Form initial={{ country: suggestions[1].value }}>
      {({ change, data }) => (
        <LinkChoice {...props} value={data.country} onChange={change} />
      )}
    </Form>
  ));
