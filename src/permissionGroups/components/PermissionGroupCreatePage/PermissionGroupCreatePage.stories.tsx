import { channels, permissions } from "@dashboard/fixtures";
import React from "react";

import { errorsOfPermissionGroupCreate } from "../../fixtures";
import {
  PermissionGroupCreatePage,
  PermissionGroupCreatePageProps,
} from "./PermissionGroupCreatePage";

const props: PermissionGroupCreatePageProps = {
  disabled: false,
  errors: [],
  onSubmit: () => new Promise(resolve => resolve(undefined)),
  permissions,
  channels,
  saveButtonBarState: "default",
  hasRestrictedChannels: false,
};

export default {
  title: "Permission Groups / Permission Group Create",
};

export const Default = () => <PermissionGroupCreatePage {...props} />;

export const Loading = () => (
  <PermissionGroupCreatePage {...props} disabled={true} />
);

export const Errors = () => (
  <PermissionGroupCreatePage
    {...props}
    errors={errorsOfPermissionGroupCreate}
  />
);
