import { permissions } from "@saleor/fixtures";
import PermissionGroupDetailsPage, {
  PermissionGroupDetailsPageProps
} from "@saleor/permissionGroups/components/PermissionGroupDetailsPage";
import {
  emptyPermissionGroup,
  permissionGroup,
  users
} from "@saleor/permissionGroups/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

const props: PermissionGroupDetailsPageProps = {
  disabled: false,
  errors: [],
  isChecked: () => false,
  members: users,
  membersModified: false,
  onAssign: () => undefined,
  onBack: () => undefined,
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
  toolbar: null
};

export default {
  title: "Views / Permission Groups / Permission Group Details",
  decorators: [Decorator]
};

export const Default = () => <PermissionGroupDetailsPage {...props} />;

Default.story = {
  name: "default"
};

export const NoMembers = () => (
  <PermissionGroupDetailsPage
    {...props}
    members={[]}
    permissionGroup={emptyPermissionGroup}
  />
);

NoMembers.story = {
  name: "no members"
};

export const Loading = () => (
  <PermissionGroupDetailsPage
    {...props}
    disabled={true}
    permissionGroup={undefined}
    permissions={undefined}
  />
);

Loading.story = {
  name: "loading"
};
