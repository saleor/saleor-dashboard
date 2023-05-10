export * from "./PermissonGroupWithChannelsDetailsPage";
import { permissions } from "@dashboard/fixtures";
import Decorator from "@dashboard/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { emptyPermissionGroup, permissionGroup, users } from "../../fixtures";
import {
  PermissonGroupWithChannelsDetailsPage,
  PermissonGroupWithChannelsDetailsPageProps,
} from "./PermissonGroupWithChannelsDetailsPage";

const props: PermissonGroupWithChannelsDetailsPageProps = {
  disabled: false,
  disabledChannelPermissions: false,
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
  channels: [],
};

storiesOf("Permission Groups / Permission Group With Channels Details", module)
  .addDecorator(Decorator)
  .add("default", () => <PermissonGroupWithChannelsDetailsPage {...props} />)
  .add("no members", () => (
    <PermissonGroupWithChannelsDetailsPage
      {...props}
      members={[]}
      permissionGroup={emptyPermissionGroup}
    />
  ))
  .add("loading", () => (
    <PermissonGroupWithChannelsDetailsPage
      {...props}
      disabled={true}
      permissionGroup={undefined}
      permissions={undefined}
    />
  ));
