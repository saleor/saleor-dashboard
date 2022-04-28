import SortableChip, {
  SortableChipProps
} from "@saleor/components/SortableChip";
import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";
import { SortableContainer } from "react-sortable-hoc";

const Container = SortableContainer(props => props.children);

const props: SortableChipProps = {
  index: 0,
  label: "Lorem Ipsum"
};

export default {
  title: "Generics / Sortable chip",
  decorators: [CardDecorator, Decorator]
};

export const Default = () => (
  <Container>
    <SortableChip {...props} />
  </Container>
);

Default.story = {
  name: "default"
};

export const WithX = () => (
  <Container>
    <SortableChip {...props} onClose={() => undefined} />
  </Container>
);

WithX.story = {
  name: "with x"
};
