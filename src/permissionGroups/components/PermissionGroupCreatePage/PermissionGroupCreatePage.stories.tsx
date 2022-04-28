import { permissions } from "@saleor/fixtures";
import PermissionGroupCreatePage, {
  PermissionGroupCreatePageProps
} from "@saleor/permissionGroups/components/PermissionGroupCreatePage";
import { errorsOfPermissionGroupCreate } from "@saleor/permissionGroups/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

const props: PermissionGroupCreatePageProps = {
  disabled: false,
  errors: [],
  onBack: () => undefined,
  onSubmit: () => undefined,
  permissions,
  saveButtonBarState: undefined
};

export default {
  title: "Views / Permission Groups / Permission Group Create",
  decorators: [Decorator]
};

export const Default = () => <PermissionGroupCreatePage {...props} />;

Default.story = {
  name: "default"
};

export const Loading = () => (
  <PermissionGroupCreatePage {...props} disabled={true} />
);

Loading.story = {
  name: "loading"
};

export const Errors = () => (
  <PermissionGroupCreatePage
    {...props}
    errors={errorsOfPermissionGroupCreate}
  />
);

Errors.story = {
  name: "errors"
};
