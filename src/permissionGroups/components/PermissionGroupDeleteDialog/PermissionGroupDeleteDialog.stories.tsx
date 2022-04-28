import {
  PermissionGroupErrorCode,
  PermissionGroupErrorFragment
} from "@saleor/graphql";
import PermissionGroupDeleteDialog, {
  PermissionDeleteDialogProps
} from "@saleor/permissionGroups/components/PermissionGroupDeleteDialog";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

const permissionsError: PermissionGroupErrorFragment = {
  __typename: "PermissionGroupError",
  code: PermissionGroupErrorCode.OUT_OF_SCOPE_PERMISSION,
  field: null,
  message: "Permission out of scope"
};

const requiredError: PermissionGroupErrorFragment = {
  __typename: "PermissionGroupError",
  code: PermissionGroupErrorCode.REQUIRED,
  field: null,
  message: "Permission required"
};

const props: PermissionDeleteDialogProps = {
  confirmButtonState: "default",
  name: "Full Access",
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true
};

export default {
  title: "Views / Permission Groups / Permission Group Delete",
  decorators: [Decorator]
};

export const RemoveSingle = () => <PermissionGroupDeleteDialog {...props} />;

RemoveSingle.story = {
  name: "remove single"
};

export const GotPermissionsError = () => (
  <PermissionGroupDeleteDialog {...props} error={permissionsError} />
);

GotPermissionsError.story = {
  name: "Got permissions error"
};

export const GetRandomPermissionGroupError = () => (
  <PermissionGroupDeleteDialog {...props} error={requiredError} />
);

GetRandomPermissionGroupError.story = {
  name: "Get random permission group error"
};
