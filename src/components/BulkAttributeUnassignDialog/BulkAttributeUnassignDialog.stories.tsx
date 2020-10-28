import BulkAttributeUnassignDialog, {
  BulkAttributeUnassignDialogProps
} from "@saleor/components/BulkAttributeUnassignDialog";
import { storiesOf } from "@storybook/react";
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

storiesOf("Generics / Unassign multiple attributes", module)
  .addDecorator(Decorator)
  .add("default", () => <BulkAttributeUnassignDialog {...props} />);
