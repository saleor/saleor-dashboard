import { permissions } from "@dashboard/fixtures";
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
  channels: [],
  saveButtonBarState: undefined,
};

export default {
  title: "Permission Groups / Permission Group Create",
};

export const Default = () => (
  <PermissionGroupWithChannelsCreatePage {...props} />
);

export const Loading = () => (
  <PermissionGroupWithChannelsCreatePage {...props} disabled={true} />
);

export const Errors = () => (
  <PermissionGroupWithChannelsCreatePage
    {...props}
    errors={errorsOfPermissionGroupCreate}
  />
);
