import {
  limits,
  limitsReached,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps,
} from "@saleor/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { PaginatorContextDecorator } from "@saleor/storybook/PaginatorContextDecorator";
import WarehouseListPage, {
  WarehouseListPageProps,
} from "@saleor/warehouses/components/WarehouseListPage";
import { WarehouseListUrlSortField } from "@saleor/warehouses/urls";
import { storiesOf } from "@storybook/react";
import React from "react";

import { warehouseList } from "../../fixtures";

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

storiesOf("Views / Warehouses / Warehouse list", module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add("default", () => <WarehouseListPage {...props} />)
  .add("loading", () => (
    <WarehouseListPage {...props} disabled={true} warehouses={undefined} />
  ))
  .add("no data", () => <WarehouseListPage {...props} warehouses={[]} />)
  .add("no limits", () => <WarehouseListPage {...props} limits={undefined} />)
  .add("limits reached", () => (
    <WarehouseListPage {...props} limits={limitsReached} />
  ));
