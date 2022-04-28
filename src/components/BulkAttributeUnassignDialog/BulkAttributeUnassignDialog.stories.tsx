import BulkAttributeUnassignDialog, {
  BulkAttributeUnassignDialogProps
} from "@saleor/components/BulkAttributeUnassignDialog";
import React from "react";

import Decorator from "../../storybook/Decorator";

const props: BulkAttributeUnassignDialogProps = {
  attributeQuantity: 4,
  confirmButtonState: "default",
  itemTypeName: "Shoes",
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
  title: "Unassign Attribute from Shoes"
};

export default {
  title: "Generics / Unassign multiple attributes",
  decorators: [Decorator]
};

export const Default = () => <BulkAttributeUnassignDialog {...props} />;

Default.story = {
  name: "default"
};
