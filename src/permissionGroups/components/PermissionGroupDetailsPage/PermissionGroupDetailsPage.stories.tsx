import { permissions } from "@saleor/fixtures";
import PermissionGroupDetailsPage, {
  PermissionGroupDetailsPageProps,
} from "@saleor/permissionGroups/components/PermissionGroupDetailsPage";
import {
  emptyPermissionGroup,
  permissionGroup,
  users,
} from "@saleor/permissionGroups/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

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

storiesOf("Views / Permission Groups / Permission Group Details", module)
  .addDecorator(Decorator)
  .add("default", () => <PermissionGroupDetailsPage {...props} />)
  .add("no members", () => (
    <PermissionGroupDetailsPage
      {...props}
      members={[]}
      permissionGroup={emptyPermissionGroup}
    />
  ))
  .add("loading", () => (
    <PermissionGroupDetailsPage
      {...props}
      disabled={true}
      permissionGroup={undefined}
      permissions={undefined}
    />
  ));
