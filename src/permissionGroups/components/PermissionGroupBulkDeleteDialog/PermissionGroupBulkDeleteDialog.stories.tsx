import { storiesOf } from "@storybook/react";
import React from "react";

import PermissionGroupBulkDeleteDialog, {
  PermissionGroupBulkDeleteDialogProps
} from "@saleor/permissionGroups/components/PermissionGroupBulkDeleteDialog";
import Decorator from "@saleor/storybook/Decorator";

const props: PermissionGroupBulkDeleteDialogProps = {
  confirmButtonState: "default",
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
  quantity: 20
};

storiesOf("Views / Permission Groups / Permission Group Delete", module)
  .addDecorator(Decorator)
  .add("single", () => (
    <PermissionGroupBulkDeleteDialog {...props} quantity={1} />
  ))
  .add("multiple", () => <PermissionGroupBulkDeleteDialog {...props} />);
