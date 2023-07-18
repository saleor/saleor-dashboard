// @ts-strict-ignore
import { channels, permissions } from "@dashboard/fixtures";
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
    permissionGroup={undefined}
    permissions={undefined}
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
