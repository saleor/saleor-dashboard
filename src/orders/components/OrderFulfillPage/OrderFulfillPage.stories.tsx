import { OrderErrorCode } from "@saleor/graphql";
import Decorator from "@saleor/storybook/Decorator";
import { warehouseList } from "@saleor/warehouses/fixtures";
import { WarehouseDetails_warehouse } from "@saleor/warehouses/types/WarehouseDetails";
import { storiesOf } from "@storybook/react";
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
  warehouse: warehouseList[0] as WarehouseDetails_warehouse
};

storiesOf("Views / Orders / Fulfill order", module)
  .addDecorator(Decorator)
  .add("default", () => <OrderFulfillPage {...props} />)
  .add("loading", () => (
    <OrderFulfillPage
      {...props}
      loading={true}
      order={undefined}
      warehouse={undefined}
    />
  ))
  .add("error", () => (
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
  ))
  .add("one warehouse", () => <OrderFulfillPage {...props} />);
