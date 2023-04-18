import { permissions } from "@dashboard/fixtures";
import Decorator from "@dashboard/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { errorsOfPermissionGroupCreate } from "../../fixtures";
import {
  NewPermissionGroupCreatePage,
  NewPermissionGroupCreatePageProps,
} from "./NewPermissionGroupCreatePage";

const props: NewPermissionGroupCreatePageProps = {
  disabled: false,
  errors: [],
  onSubmit: () => undefined,
  permissions,
  saveButtonBarState: undefined,
  channels: [],
};

storiesOf("Permission Groups / Permission Group Create", module)
  .addDecorator(Decorator)
  .add("default", () => <NewPermissionGroupCreatePage {...props} />)
  .add("loading", () => (
    <NewPermissionGroupCreatePage {...props} disabled={true} />
  ))
  .add("errors", () => (
    <NewPermissionGroupCreatePage
      {...props}
      errors={errorsOfPermissionGroupCreate}
    />
  ));
