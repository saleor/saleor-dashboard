import AttributeUnassignDialog, {
  AttributeUnassignDialogProps
} from "@saleor/components/AttributeUnassignDialog";
import React from "react";

import Decorator from "../../storybook/Decorator";

const props: AttributeUnassignDialogProps = {
  attributeName: "Size",
  confirmButtonState: "default",
  itemTypeName: "Shoes",
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
  title: "Unassign Attribute from Shoes"
};

export default {
  title: "Generics / Unassign attribute",
  decorators: [Decorator]
};

export const Default = () => <AttributeUnassignDialog {...props} />;

Default.story = {
  name: "default"
};
