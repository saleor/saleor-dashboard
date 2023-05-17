import { permissions } from "@dashboard/fixtures";
import React from "react";

import { emptyPermissionGroup, permissionGroup, users } from "../../fixtures";
import PermissionGroupDetailsPage, {
  PermissionGroupDetailsPageProps,
} from "./PermissionGroupDetailsPage";

const props: PermissionGroupDetailsPageProps = {
  disabled: false,
  errors: [],
  isChecked: () => false,
  members: users,
  onAssign: () => undefined,
  onSort: () => undefined,
  onSubmit: () => undefined,
  onUnassign: () => undefined,
  permissionGroup,
  permissions,
  permissionsExceeded: false,
  saveButtonBarState: undefined,
  selected: 0,
  sort: null,
  toggle: () => undefined,
  toggleAll: () => undefined,
  toolbar: null,
};

export default {
  title: "Permission Groups / Permission Group Details",
};

export const Default = () => <PermissionGroupDetailsPage {...props} />;

export const NoMembers = () => (
  <PermissionGroupDetailsPage
    {...props}
    members={[]}
    permissionGroup={emptyPermissionGroup}
  />
);

export const Loading = () => (
  <PermissionGroupDetailsPage
    {...props}
    disabled={true}
    permissionGroup={undefined}
    permissions={undefined}
  />
);
