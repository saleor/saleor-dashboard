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
  PermissonGroupWithChannelsDetailsPage,
  PermissonGroupWithChannelsDetailsPageProps,
} from "./PermissonGroupWithChannelsDetailsPage";
export * from "./PermissonGroupWithChannelsDetailsPage";

const props: PermissonGroupWithChannelsDetailsPageProps = {
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

export const Default = () => (
  <PermissonGroupWithChannelsDetailsPage {...props} />
);

export const NoMembers = () => (
  <PermissonGroupWithChannelsDetailsPage
    {...props}
    members={[]}
    permissionGroup={emptyPermissionGroup}
  />
);

export const Loading = () => (
  <PermissonGroupWithChannelsDetailsPage
    {...props}
    disabled={true}
    permissionGroup={undefined}
    permissions={undefined}
  />
);

export const WithRestrictedChannels = () => (
  <PermissonGroupWithChannelsDetailsPage
    {...props}
    permissionGroup={permissionGroupWithChannels}
  />
);

export const WithRestrictedChannelsAndWithoutAccessToEdit = () => (
  <PermissonGroupWithChannelsDetailsPage
    {...props}
    disabled={true}
    isUserAbleToEditChannesl={false}
    permissionGroup={permissionGroupWithChannels}
  />
);
