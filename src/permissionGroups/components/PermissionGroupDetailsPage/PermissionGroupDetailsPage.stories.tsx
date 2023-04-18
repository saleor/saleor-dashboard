import { permissions } from "@dashboard/fixtures";
import Decorator from "@dashboard/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { emptyPermissionGroup, permissionGroup, users } from "../../fixtures";
import {
  NewPermissionGroupDetailsPage,
  NewPermissionGroupDetailsPageProps,
} from "./NewPermissionGroupDetailsPage";

const props: NewPermissionGroupDetailsPageProps = {
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
  channels: [],
};

storiesOf("Permission Groups / Permission Group Details", module)
  .addDecorator(Decorator)
  .add("default", () => <NewPermissionGroupDetailsPage {...props} />)
  .add("no members", () => (
    <NewPermissionGroupDetailsPage
      {...props}
      members={[]}
      permissionGroup={emptyPermissionGroup}
    />
  ))
  .add("loading", () => (
    <NewPermissionGroupDetailsPage
      {...props}
      disabled={true}
      permissionGroup={undefined}
      permissions={undefined}
    />
  ));
