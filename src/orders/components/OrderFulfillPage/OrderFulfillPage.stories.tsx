import { OrderErrorCode } from "@saleor/graphql";
import Decorator from "@saleor/storybook/Decorator";
import { warehouseList } from "@saleor/warehouses/fixtures";
import { storiesOf } from "@storybook/react";
import React from "react";

import { orderToFulfill } from "./fixtures";
import OrderFulfillPage, { OrderFulfillPageProps } from "./OrderFulfillPage";

const props: OrderFulfillPageProps = {
  params: {},
  errors: [],
  loading: false,
  onSubmit: () => undefined,
  order: orderToFulfill,
  saveButtonBar: "default",
  openModal: () => undefined,
  closeModal: () => undefined,
};

storiesOf("Views / Orders / Fulfill order", module)
  .addDecorator(Decorator)
  .add("default", () => <OrderFulfillPage {...props} />)
  .add("loading", () => (
    <OrderFulfillPage {...props} loading={true} order={undefined} />
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
          message: "Insufficient stock",
        },
      ]}
    />
  ))
  .add("one warehouse", () => <OrderFulfillPage {...props} />);
