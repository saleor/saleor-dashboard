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
  PermissonGroupDetailsPage,
  PermissonGroupDetailsPageProps,
} from "./PermissonGroupDetailsPage";
export * from "./PermissonGroupDetailsPage";

const props: PermissonGroupDetailsPageProps = {
  disabled: false,
  isUserAbleToEditChannesl: true,
  errors: [],
  isChecked: () => false,
  members: users,
  onAssign: () => undefined,
  onSort: () => undefined,
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
  title: "Permission Groups / Permission Group Details With Channels",
};

export const Default = () => <PermissonGroupDetailsPage {...props} />;

export const NoMembers = () => (
  <PermissonGroupDetailsPage
    {...props}
    members={[]}
    permissionGroup={emptyPermissionGroup}
  />
);

export const Loading = () => (
  <PermissonGroupDetailsPage
    {...props}
    disabled={true}
    permissionGroup={permissionGroup}
    permissions={permissions}
  />
);

export const WithRestrictedChannels = () => (
  <PermissonGroupDetailsPage
    {...props}
    permissionGroup={permissionGroupWithChannels}
  />
);

export const WithRestrictedChannelsAndWithoutAccessToEdit = () => (
  <PermissonGroupDetailsPage
    {...props}
    disabled={true}
    isUserAbleToEditChannesl={false}
    permissionGroup={permissionGroupWithChannels}
  />
);
