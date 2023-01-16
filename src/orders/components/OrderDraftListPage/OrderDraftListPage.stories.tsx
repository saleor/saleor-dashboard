import {
  filterPageProps,
  limits,
  limitsReached,
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps,
} from "@dashboard/fixtures";
import { OrderDraftListUrlSortField } from "@dashboard/orders/urls";
import Decorator from "@dashboard/storybook/Decorator";
import { PaginatorContextDecorator } from "@dashboard/storybook/PaginatorContextDecorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { orders } from "../../fixtures";
import OrderDraftListPage, {
  OrderDraftListPageProps,
} from "./OrderDraftListPage";

const props: OrderDraftListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  ...tabPageProps,
  ...filterPageProps,
  filterOpts: {
    created: {
      active: false,
      value: {
        max: undefined,
        min: undefined,
      },
    },
    customer: {
      active: false,
      value: undefined,
    },
  },
  limits,
  onAdd: () => undefined,
  orders,
  sort: {
    ...sortPageProps.sort,
    sort: OrderDraftListUrlSortField.number,
  },
};

storiesOf("Orders / Draft order list", module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add("default", () => <OrderDraftListPage {...props} />)
  .add("loading", () => (
    <OrderDraftListPage {...props} disabled orders={undefined} />
  ))
  .add("when no data", () => <OrderDraftListPage {...props} orders={[]} />)
  .add("limits reached", () => (
    <OrderDraftListPage {...props} limits={limitsReached} />
  ));
