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
import React from "react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
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

export default {
  title: "Orders / Draft order list",
  decorators: [PaginatorContextDecorator],
};

export const Default = () => <OrderDraftListPage {...props} />;

export const Loading = () => (
  <OrderDraftListPage {...props} disabled orders={undefined} />
);

export const WhenNoData = () => <OrderDraftListPage {...props} orders={[]} />;

export const LimitsReached = () => (
  <OrderDraftListPage {...props} limits={limitsReached} />
);
