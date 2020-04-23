import { storiesOf } from "@storybook/react";
import React from "react";

import PermissionGroupDeleteDialog, {
  PermissionDeleteDialogProps
} from "@saleor/permissionGroups/components/PermissionGroupDeleteDialog";
import Decorator from "@saleor/storybook/Decorator";

const props: PermissionDeleteDialogProps = {
  confirmButtonState: "default",
  name: "Full Access",
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true
};

storiesOf("Views / Permission Groups / Permission Group Delete", module)
  .addDecorator(Decorator)
  .add("remove single", () => <PermissionGroupDeleteDialog {...props} />);
