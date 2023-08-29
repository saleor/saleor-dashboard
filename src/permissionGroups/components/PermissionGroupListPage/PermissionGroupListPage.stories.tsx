// @ts-strict-ignore
import {
  listActionsProps,
  pageListProps,
  sortPageProps,
} from "@dashboard/fixtures";
import React from "react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import { permissionGroups } from "../../fixtures";
import { PermissionGroupListUrlSortField } from "../../urls";
import PermissionGroupListPage, {
  PermissionGroupListPageProps,
} from "./PermissionGroupListPage";

const props: PermissionGroupListPageProps = {
  permissionGroups,
  ...listActionsProps,
  ...pageListProps.default,
  ...sortPageProps,
  disabled: false,
  sort: {
    ...sortPageProps.sort,
    sort: PermissionGroupListUrlSortField.name,
  },
};

export default {
  title: "Permission Groups / Permission Group List",
  decorators: [PaginatorContextDecorator],
};

export const Default = () => <PermissionGroupListPage {...props} />;

export const Loading = () => (
  <PermissionGroupListPage
    {...props}
    permissionGroups={undefined}
    disabled={true}
  />
);
