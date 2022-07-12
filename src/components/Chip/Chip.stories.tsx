import Chip, { ChipProps } from "@saleor/components/Chip";
import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

const props: ChipProps = {
  label: "Lorem Ipsum",
};

storiesOf("Generics / Chip", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("default", () => <Chip {...props} />)
  .add("with x", () => <Chip {...props} onClose={() => undefined} />);
