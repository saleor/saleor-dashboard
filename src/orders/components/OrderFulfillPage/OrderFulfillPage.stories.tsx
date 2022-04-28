import { OrderErrorCode } from "@saleor/graphql";
import Decorator from "@saleor/storybook/Decorator";
import { warehouseList } from "@saleor/warehouses/fixtures";
import React from "react";

import { orderToFulfill } from "./fixtures";
import OrderFulfillPage, { OrderFulfillPageProps } from "./OrderFulfillPage";

const props: OrderFulfillPageProps = {
  errors: [],
  loading: false,
  onBack: () => undefined,
  onSubmit: () => undefined,
  order: orderToFulfill,
  saveButtonBar: "default",
  warehouses: warehouseList
};

export default {
  title: "Views / Orders / Fulfill order",
  decorators: [Decorator]
};

export const Default = () => <OrderFulfillPage {...props} />;

Default.story = {
  name: "default"
};

export const Loading = () => (
  <OrderFulfillPage
    {...props}
    loading={true}
    order={undefined}
    warehouses={undefined}
  />
);

Loading.story = {
  name: "loading"
};

export const Error = () => (
  <OrderFulfillPage
    {...props}
    errors={[
      {
        __typename: "OrderError",
        code: OrderErrorCode.INSUFFICIENT_STOCK,
        field: null,
        orderLines: [orderToFulfill.lines[0].id],
        warehouse: warehouseList[0].id,
        addressType: null,
        message: "Insufficient stock"
      }
    ]}
  />
);

Error.story = {
  name: "error"
};

export const OneWarehouse = () => (
  <OrderFulfillPage {...props} warehouses={warehouseList.slice(0, 1)} />
);

OneWarehouse.story = {
  name: "one warehouse"
};
