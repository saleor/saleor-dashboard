import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { allPermissions } from "@saleor/hooks/makeQuery";
import { order, warehouseSearch } from "@saleor/orders/fixtures";
import { searchWarehouses } from "@saleor/searches/useWarehouseSearch";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import OrderChangeWarehouseDialog, { OrderChangeWarehouseDialogProps } from ".";

const props: OrderChangeWarehouseDialogProps = {
  open: true,
  lines: order("abc").lines,
  currentWarehouse: null,
  onConfirm: () => null,
  onClose: () => null,
};

const mocks: MockedResponse[] = [
  {
    request: {
      query: searchWarehouses,
      variables: {
        first: 20,
        after: null,
        query: "",
        ...allPermissions,
      },
    },
    result: {
      data: { search: warehouseSearch },
    },
  },
];

storiesOf(
  "Orders / Order details fulfillment warehouse selection modal",
  module,
)
  .addDecorator(Decorator)
  .add("default", () => (
    <MockedProvider mocks={mocks}>
      <OrderChangeWarehouseDialog {...props} />
    </MockedProvider>
  ));
