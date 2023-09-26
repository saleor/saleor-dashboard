import { channels, permissions } from "@dashboard/fixtures";
import { MembersListUrlSortField } from "@dashboard/permissionGroups/urls";
import React from "react";

import {
  emptyPermissionGroup,
  permissionGroup,
  permissionGroupWithChannels,
  users,
} from "../../fixtures";
import {
  PermissionGroupDetailsPage,
  PermissonGroupDetailsPageProps,
} from "./PermissionGroupDetailsPage";
export * from "./PermissionGroupDetailsPage";

const props: PermissonGroupDetailsPageProps = {
  disabled: false,
  isUserAbleToEditChannels: true,
  errors: [],
  isChecked: () => false,
  members: users,
  onAssign: () => undefined,
  onSort: () => undefined,
  onDelete: () => undefined,
  onSubmit: () => new Promise(resolve => resolve(undefined)),
  onUnassign: () => undefined,
  permissionGroup,
  permissions,
  permissionsExceeded: false,
  saveButtonBarState: "default",
  selected: 0,
  sort: {
    asc: true,
    sort: MembersListUrlSortField.name,
  },
  toggle: () => undefined,
  toggleAll: () => undefined,
  toolbar: null,
  channels,
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
    permissionGroup={permissionGroup}
    permissions={permissions}
  />
);

export const WithRestrictedChannels = () => (
  <PermissionGroupDetailsPage
    {...props}
    permissionGroup={permissionGroupWithChannels}
  />
);

export const WithRestrictedChannelsAndWithoutAccessToEdit = () => (
  <PermissionGroupDetailsPage
    {...props}
    disabled={true}
    isUserAbleToEditChannels={false}
    permissionGroup={permissionGroupWithChannels}
  />
);
