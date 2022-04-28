import { attributes } from "@saleor/attributes/fixtures";
import AssignAttributeDialog, {
  AssignAttributeDialogProps
} from "@saleor/components/AssignAttributeDialog";
import { fetchMoreProps } from "@saleor/fixtures";
import { formError } from "@saleor/storybook/misc";
import React from "react";

import Decorator from "../../storybook/Decorator";

const props: AssignAttributeDialogProps = {
  ...fetchMoreProps,
  attributes: attributes.slice(0, 5),
  confirmButtonState: "default",
  errors: [],
  onClose: () => undefined,
  onFetch: () => undefined,
  onOpen: () => undefined,
  onSubmit: () => undefined,
  onToggle: () => undefined,
  open: true,
  selected: [attributes[0].id, attributes[3].id]
};

export default {
  title: "Generics / Assign attributes dialog",
  decorators: [Decorator]
};

export const Default = () => <AssignAttributeDialog {...props} />;

Default.story = {
  name: "default"
};

export const Loading = () => (
  <AssignAttributeDialog {...props} attributes={undefined} loading={true} />
);

Loading.story = {
  name: "loading"
};

export const Errors = () => (
  <AssignAttributeDialog {...props} errors={[formError("").message]} />
);

Errors.story = {
  name: "errors"
};
