import {
  limits,
  limitsReached,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps,
} from "@dashboard/fixtures";
import { WarehouseListUrlSortField } from "@dashboard/warehouses/urls";
import React from "react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import { warehouseList } from "../../fixtures";
import WarehouseListPage, { WarehouseListPageProps } from "./WarehouseListPage";

const props: WarehouseListPageProps = {
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  ...tabPageProps,
  limits,
  onRemove: () => undefined,
  sort: {
    ...sortPageProps.sort,
    sort: WarehouseListUrlSortField.name,
  },
  warehouses: warehouseList,
};

export default {
  title: "Warehouses / Warehouse list",
  decorators: [PaginatorContextDecorator],
};

export const Default = () => <WarehouseListPage {...props} />;

export const Loading = () => (
  <WarehouseListPage {...props} disabled={true} warehouses={undefined} />
);

export const NoData = () => <WarehouseListPage {...props} warehouses={[]} />;

export const NoLimits = () => (
  <WarehouseListPage {...props} limits={undefined} />
);

export const LimitsReached = () => (
  <WarehouseListPage {...props} limits={limitsReached} />
);
