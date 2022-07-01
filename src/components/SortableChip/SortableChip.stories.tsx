import SortableChip, {
  SortableChipProps,
} from "@saleor/components/SortableChip";
import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";
import { SortableContainer } from "react-sortable-hoc";

const Container = SortableContainer(props => props.children);

const props: SortableChipProps = {
  index: 0,
  label: "Lorem Ipsum",
};

storiesOf("Generics / Sortable chip", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("default", () => (
    <Container>
      <SortableChip {...props} />
    </Container>
  ))
  .add("with x", () => (
    <Container>
      <SortableChip {...props} onClose={() => undefined} />
    </Container>
  ));
