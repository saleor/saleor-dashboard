import { storiesOf } from "@storybook/react";
import React from "react";

import PermissionGroupDeleteDialog, {
  PermissionDeleteDialogProps
} from "@saleor/permissionGroups/components/PermissionGroupDeleteDialog";
import Decorator from "@saleor/storybook/Decorator";

const props: PermissionDeleteDialogProps = {
  confirmButtonState: "default",
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
  quantity: 20
};

storiesOf("Views / Permission Groups / Permission Group Delete", module)
  .addDecorator(Decorator)
  .add("single", () => <PermissionGroupDeleteDialog {...props} quantity={1} />)
  .add("multiple", () => <PermissionGroupDeleteDialog {...props} />);
