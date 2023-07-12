// @ts-strict-ignore
import { OrderErrorCode } from "@dashboard/graphql";
import { warehouseList } from "@dashboard/warehouses/fixtures";
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

export default {
  title: "Orders / Fulfill order",
};

export const Default = () => <OrderFulfillPage {...props} />;

export const Loading = () => (
  <OrderFulfillPage {...props} loading={true} order={undefined} />
);

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
        message: "Insufficient stock",
      },
    ]}
  />
);

export const OneWarehouse = () => <OrderFulfillPage {...props} />;
