import Chip, { ChipProps } from "@saleor/components/Chip";
import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

const props: ChipProps = {
  label: "Lorem Ipsum"
};

export default {
  title: "Generics / Chip",
  decorators: [CardDecorator, Decorator]
};

export const Default = () => <Chip {...props} />;

Default.story = {
  name: "default"
};

export const WithX = () => <Chip {...props} onClose={() => undefined} />;

WithX.story = {
  name: "with x"
};
