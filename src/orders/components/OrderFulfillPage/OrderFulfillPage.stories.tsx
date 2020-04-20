import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "@saleor/storybook/Decorator";
import { warehouseList } from "@saleor/warehouses/fixtures";
import OrderFulfillPage, { OrderFulfillPageProps } from "./OrderFulfillPage";
import { orderToFulfill } from "./fixtures";

const props: OrderFulfillPageProps = {
  disabled: false,
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
  ));
