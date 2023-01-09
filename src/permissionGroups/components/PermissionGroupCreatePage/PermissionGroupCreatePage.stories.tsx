import { permissions } from "@saleor/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { errorsOfPermissionGroupCreate } from "../../fixtures";
import PermissionGroupCreatePage, {
  PermissionGroupCreatePageProps,
} from "./PermissionGroupCreatePage";

const props: PermissionGroupCreatePageProps = {
  disabled: false,
  errors: [],
  onSubmit: () => undefined,
  permissions,
  saveButtonBarState: undefined,
};

storiesOf("Permission Groups / Permission Group Create", module)
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
