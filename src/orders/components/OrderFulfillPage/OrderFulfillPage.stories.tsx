import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "@saleor/storybook/Decorator";
import { warehouseList } from "@saleor/warehouses/fixtures";
import { OrderErrorCode } from "@saleor/types/globalTypes";
import OrderFulfillPage, { OrderFulfillPageProps } from "./OrderFulfillPage";
import { orderToFulfill } from "./fixtures";

const props: OrderFulfillPageProps = {
  disabled: false,
  errors: [],
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
      disabled={true}
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
