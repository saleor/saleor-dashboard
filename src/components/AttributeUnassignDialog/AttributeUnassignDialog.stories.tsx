import AttributeUnassignDialog, {
  AttributeUnassignDialogProps,
} from "@saleor/components/AttributeUnassignDialog";
import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "../../storybook/Decorator";

const props: AttributeUnassignDialogProps = {
  attributeName: "Size",
  confirmButtonState: "default",
  itemTypeName: "Shoes",
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
  title: "Unassign Attribute from Shoes",
};

storiesOf("Generics / Unassign attribute", module)
  .addDecorator(Decorator)
  .add("default", () => <AttributeUnassignDialog {...props} />);
