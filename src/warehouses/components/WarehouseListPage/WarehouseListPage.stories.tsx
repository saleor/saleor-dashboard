import { storiesOf } from "@storybook/react";
import React from "react";

import {
  pageListProps,
  tabPageProps,
  sortPageProps,
  searchPageProps
} from "@saleor/fixtures";
import WarehouseListPage, {
  WarehouseListPageProps
} from "@saleor/warehouses/components/WarehouseListPage";
import Decorator from "@saleor/storybook/Decorator";
import { WarehouseListUrlSortField } from "@saleor/warehouses/urls";
import { warehouseList } from "../../fixtures";

const props: WarehouseListPageProps = {
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  ...tabPageProps,
  onBack: () => undefined,
  onRemove: () => undefined,
  sort: {
    ...sortPageProps.sort,
    sort: WarehouseListUrlSortField.name
  },
  warehouses: warehouseList
};

storiesOf("Views / Warehouses / Warehouse list", module)
  .addDecorator(Decorator)
  .add("default", () => <WarehouseListPage {...props} />)
  .add("loading", () => (
    <WarehouseListPage {...props} disabled={true} warehouses={undefined} />
  ))
  .add("no data", () => <WarehouseListPage {...props} warehouses={[]} />);
