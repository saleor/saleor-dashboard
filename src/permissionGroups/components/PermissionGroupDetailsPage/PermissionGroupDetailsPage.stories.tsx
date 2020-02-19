import { storiesOf } from "@storybook/react";
import React from "react";
import { permissions } from "@saleor/fixtures";

import PermissionGroupDetailsPage, {
  PermissionGroupDetailsPageProps
} from "@saleor/permissionGroups/components/PermissionGroupDetailsPage";
import Decorator from "@saleor/storybook/Decorator";
import { permissionGroup } from "../../fixtures";

const props: PermissionGroupDetailsPageProps = {
  disabled: false,
  errors: [],
  isChecked: () => false,
  onAssign: () => undefined,
  onBack: () => undefined,
  onSubmit: () => undefined,
  onUnassign: () => undefined,
  permissionGroup,
  permissions,
  saveButtonBarState: undefined,
  selected: undefined,
  toggle: () => undefined,
  toggleAll: () => undefined,
  toolbar: null
};

storiesOf("Views / Permission Groups / Permission Group Details", module)
  .addDecorator(Decorator)
  .add("default", () => <PermissionGroupDetailsPage {...props} />)
  .add("loading", () => (
    <PermissionGroupDetailsPage
      {...props}
      disabled={true}
      permissionGroup={undefined}
      permissions={undefined}
    />
  ));
