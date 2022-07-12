import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import SortableChipsField, {
  SortableChipsFieldProps,
} from "./SortableChipsField";

const props: SortableChipsFieldProps = {
  onValueDelete: () => undefined,
  onValueReorder: () => undefined,
  values: [
    { label: "Item 1", value: "item-1" },
    { label: "Item 2", value: "item-2" },
    { label: "Item 3", value: "item-3" },
    { label: "Item 4", value: "item-4" },
    { label: "Item 5", value: "item-5" },
    { label: "Item 6", value: "item-6" },
  ],
};

storiesOf("Generics / Sortable chips field", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("default", () => <SortableChipsField {...props} />)
  .add("loading", () => <SortableChipsField {...props} loading={true} />)
  .add("with error", () => (
    <SortableChipsField
      {...props}
      error={true}
      helperText="Something went wrong"
    />
  ));
