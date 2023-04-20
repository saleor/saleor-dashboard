import { permissions } from "@dashboard/fixtures";
import Decorator from "@dashboard/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { errorsOfPermissionGroupCreate } from "../../fixtures";
import {
  PermissionGroupWithChannelsCreatePage,
  PermissionGroupWithChannelsCreatePageProps,
} from "./PermissionGroupWithChannelsCreatePage";

const props: PermissionGroupWithChannelsCreatePageProps = {
  disabled: false,
  errors: [],
  onSubmit: () => undefined,
  permissions,
  saveButtonBarState: undefined,
  channels: [],
};

storiesOf("Permission Groups / Permission Group Create", module)
  .addDecorator(Decorator)
  .add("default", () => <PermissionGroupWithChannelsCreatePage {...props} />)
  .add("loading", () => (
    <PermissionGroupWithChannelsCreatePage {...props} disabled={true} />
  ))
  .add("errors", () => (
    <PermissionGroupWithChannelsCreatePage
      {...props}
      errors={errorsOfPermissionGroupCreate}
    />
  ));
