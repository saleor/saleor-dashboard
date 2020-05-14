import { permissions } from "@saleor/fixtures";
import PermissionGroupCreatePage, {
  PermissionGroupCreatePageProps
} from "@saleor/permissionGroups/components/PermissionGroupCreatePage";
import { errorsOfPermissionGroupCreate } from "@saleor/permissionGroups/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

const props: PermissionGroupCreatePageProps = {
  disabled: false,
  errors: [],
  onBack: () => undefined,
  onSubmit: () => undefined,
  permissions,
  saveButtonBarState: undefined
};

storiesOf("Views / Permission Groups / Permission Group Create", module)
  .addDecorator(Decorator)
  .add("default", () => <PermissionGroupCreatePage {...props} />)
  .add("loading", () => (
    <PermissionGroupCreatePage {...props} disabled={true} />
  ))
  .add("errors", () => (
    <PermissionGroupCreatePage
      {...props}
      errors={errorsOfPermissionGroupCreate}
    />
  ));
