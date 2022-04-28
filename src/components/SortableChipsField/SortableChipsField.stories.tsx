import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import SortableChipsField, {
  SortableChipsFieldProps
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
    { label: "Item 6", value: "item-6" }
  ]
};

export default {
  title: "Generics / Sortable chips field",
  decorators: [CardDecorator, Decorator]
};

export const Default = () => <SortableChipsField {...props} />;

Default.story = {
  name: "default"
};

export const Loading = () => <SortableChipsField {...props} loading={true} />;

Loading.story = {
  name: "loading"
};

export const WithError = () => (
  <SortableChipsField
    {...props}
    error={true}
    helperText="Something went wrong"
  />
);

WithError.story = {
  name: "with error"
};
