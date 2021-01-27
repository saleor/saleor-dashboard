import { PermissionGroupErrorFragment } from "@saleor/fragments/types/PermissionGroupErrorFragment";
import PermissionGroupDeleteDialog, {
  PermissionDeleteDialogProps
} from "@saleor/permissionGroups/components/PermissionGroupDeleteDialog";
import Decorator from "@saleor/storybook/Decorator";
import { PermissionGroupErrorCode } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

const permissionsError: PermissionGroupErrorFragment = {
  __typename: "PermissionGroupError",
  code: PermissionGroupErrorCode.OUT_OF_SCOPE_PERMISSION,
  field: null
};

const requiredError: PermissionGroupErrorFragment = {
  __typename: "PermissionGroupError",
  code: PermissionGroupErrorCode.REQUIRED,
  field: null
};

const props: PermissionDeleteDialogProps = {
  confirmButtonState: "default",
  name: "Full Access",
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true
};

storiesOf("Views / Permission Groups / Permission Group Delete", module)
  .addDecorator(Decorator)
  .add("remove single", () => <PermissionGroupDeleteDialog {...props} />)
  .add("Got permissions error", () => (
    <PermissionGroupDeleteDialog {...props} error={permissionsError} />
  ))
  .add("Get random permission group error", () => (
    <PermissionGroupDeleteDialog {...props} error={requiredError} />
  ));
