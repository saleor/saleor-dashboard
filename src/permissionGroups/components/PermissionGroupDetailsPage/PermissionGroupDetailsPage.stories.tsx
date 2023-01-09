import { permissions } from "@saleor/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
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

storiesOf("Permission Groups / Permission Group Details", module)
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
