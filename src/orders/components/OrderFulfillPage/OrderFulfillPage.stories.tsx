import Decorator from "@saleor/storybook/Decorator";
import { warehouseList } from "@saleor/warehouses/fixtures";
import { storiesOf } from "@storybook/react";
import React from "react";

import { orderToFulfill } from "./fixtures";
import OrderFulfillPage, { OrderFulfillPageProps } from "./OrderFulfillPage";

const props: OrderFulfillPageProps = {
  loading: false,
  onBack: () => undefined,
  onSubmit: () => undefined,
  formsetData: [],
  formsetChange: () => undefined,
  sendInfo: false,
  setSendInfo: () => undefined,
  order: orderToFulfill,
  saveButtonBar: "default",
  warehouses: warehouseList
};

storiesOf("Views / Orders / Fulfill order", module)
  .addDecorator(Decorator)
  .add("default", () => <OrderFulfillPage {...props} />)
  .add("loading", () => (
    <OrderFulfillPage
      {...props}
      loading={true}
      order={undefined}
      warehouses={undefined}
    />
  ))
  .add("error", () => <OrderFulfillPage {...props} />)
  .add("one warehouse", () => (
    <OrderFulfillPage {...props} warehouses={warehouseList.slice(0, 1)} />
  ));
