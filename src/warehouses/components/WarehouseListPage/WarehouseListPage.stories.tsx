import {
  limits,
  limitsReached,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps
} from "@saleor/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import WarehouseListPage, {
  WarehouseListPageProps
} from "@saleor/warehouses/components/WarehouseListPage";
import { WarehouseListUrlSortField } from "@saleor/warehouses/urls";
import React from "react";

import { warehouseList } from "../../fixtures";

const props: WarehouseListPageProps = {
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  ...tabPageProps,
  limits,
  onBack: () => undefined,
  onRemove: () => undefined,
  sort: {
    ...sortPageProps.sort,
    sort: WarehouseListUrlSortField.name
  },
  warehouses: warehouseList
};

export default {
  title: "Views / Warehouses / Warehouse list",
  decorators: [Decorator]
};

export const Default = () => <WarehouseListPage {...props} />;

Default.story = {
  name: "default"
};

export const Loading = () => (
  <WarehouseListPage {...props} disabled={true} warehouses={undefined} />
);

Loading.story = {
  name: "loading"
};

export const NoData = () => <WarehouseListPage {...props} warehouses={[]} />;

NoData.story = {
  name: "no data"
};

export const NoLimits = () => (
  <WarehouseListPage {...props} limits={undefined} />
);

NoLimits.story = {
  name: "no limits"
};

export const LimitsReached = () => (
  <WarehouseListPage {...props} limits={limitsReached} />
);

LimitsReached.story = {
  name: "limits reached"
};
