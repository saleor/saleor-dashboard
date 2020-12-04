import Decorator from "@saleor/storybook/Decorator";
import { OrderErrorCode } from "@saleor/types/globalTypes";
import { warehouseList } from "@saleor/warehouses/fixtures";
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
  .add("error", () => (
    <OrderFulfillPage
      {...props}
      errors={[
        {
          __typename: "OrderError",
          code: OrderErrorCode.INSUFFICIENT_STOCK,
          field: null,
          orderLine: orderToFulfill.lines[0].id,
          warehouse: warehouseList[0].id
        }
      ]}
    />
  ))
  .add("one warehouse", () => (
    <OrderFulfillPage {...props} warehouses={warehouseList.slice(0, 1)} />
  ));
