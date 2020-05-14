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
import { storiesOf } from "@storybook/react";
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

storiesOf("Views / Permission Groups / Permission Group List", module)
  .addDecorator(Decorator)
  .add("default", () => <PermissionGroupListPage {...props} />)
  .add("loading", () => (
    <PermissionGroupListPage
      {...props}
      permissionGroups={undefined}
      disabled={true}
    />
  ))
  .add("no data", () => (
    <PermissionGroupListPage {...props} permissionGroups={[]} disabled={true} />
  ));
