import {
  listActionsProps,
  pageListProps,
  sortPageProps
} from "@saleor/fixtures";
import PermissionGroupListPage, {
  PermissionGroupListPageProps
} from "@saleor/permissionGroups/components/PermissionGroupListPage";
import { permissionGroups } from "@saleor/permissionGroups/fixtures";
import { PermissionGroupListUrlSortField } from "@saleor/permissionGroups/urls";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

const props: PermissionGroupListPageProps = {
  permissionGroups,
  ...listActionsProps,
  ...pageListProps.default,
  ...sortPageProps,
  disabled: false,
  onBack: () => undefined,
  onDelete: () => undefined,
  sort: {
    ...sortPageProps.sort,
    sort: PermissionGroupListUrlSortField.name
  }
};

export default {
  title: "Views / Permission Groups / Permission Group List",
  decorators: [Decorator]
};

export const Default = () => <PermissionGroupListPage {...props} />;

Default.story = {
  name: "default"
};

export const Loading = () => (
  <PermissionGroupListPage
    {...props}
    permissionGroups={undefined}
    disabled={true}
  />
);

Loading.story = {
  name: "loading"
};

export const NoData = () => (
  <PermissionGroupListPage {...props} permissionGroups={[]} disabled={true} />
);

NoData.story = {
  name: "no data"
};
