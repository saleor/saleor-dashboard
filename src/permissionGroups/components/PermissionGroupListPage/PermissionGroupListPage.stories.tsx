import {
  listActionsProps,
  pageListProps,
  sortPageProps,
} from "@saleor/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { PaginatorContextDecorator } from "@saleor/storybook/PaginatorContextDecorator";
import { storiesOf } from "@storybook/react";
import React from "react";

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
  onDelete: () => undefined,
  sort: {
    ...sortPageProps.sort,
    sort: PermissionGroupListUrlSortField.name,
  },
};

storiesOf("Permission Groups / Permission Group List", module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
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
