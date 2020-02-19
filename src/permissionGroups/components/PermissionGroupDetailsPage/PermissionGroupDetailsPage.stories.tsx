import { storiesOf } from "@storybook/react";
import React from "react";
import { permissions } from "@saleor/fixtures";
import { Button } from "@material-ui/core";

import PermissionGroupDetailsPage, {
  PermissionGroupDetailsPageProps
} from "@saleor/permissionGroups/components/PermissionGroupDetailsPage";
import Decorator from "@saleor/storybook/Decorator";
import { permissionGroup } from "../../fixtures";

const props: PermissionGroupDetailsPageProps = {
  disabled: false,
  errors: [],
  isChecked: id => false,
  onAssign: () => undefined,
  onBack: () => undefined,
  onSubmit: () => undefined,
  onUnassign: () => undefined,
  permissionGroup,
  permissions,
  saveButtonBarState: undefined,
  selected: undefined,
  toolbar: <Button />,
  toggle: id => undefined,
  toggleAll: () => undefined
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
