import { ChannelWarehouses } from "@saleor/channels/pages/ChannelDetailsPage/types";
import CommonDecorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import Warehouses from "./Warehouses";

const warehouses = [
  {
    __typename: "Warehouse",
    id: "2",
    name: "Fancy warehouse",
  },
  {
    __typename: "Warehouse",
    id: "3",
    name: "Nice warehouse",
  },
];

const baseProps = {
  addWarehouse: () => undefined,
  removeWarehouse: () => undefined,
  searchWarehouses: () => undefined,
  fetchMoreWarehouses: {
    loading: false,
    hasMore: false,
    onFetchMore: () => undefined,
    totalCount: 0,
  },
  warehouses: [],
  warehousesChoices: warehouses as ChannelWarehouses,
};

storiesOf("Warehouses", module)
  .addDecorator(CommonDecorator)
  .add("with no options selected", () => <Warehouses {...baseProps} />)
  .add("with options selected", () => (
    <Warehouses {...baseProps} warehouses={warehouses as ChannelWarehouses} />
  ));
