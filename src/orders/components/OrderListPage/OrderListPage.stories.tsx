import {
  filterPageProps,
  limits,
  limitsReached,
  listActionsProps,
  pageListProps,
  sortPageProps,
} from "@dashboard/fixtures";
import { OrderStatusFilter, PaymentChargeStatusEnum } from "@dashboard/graphql";
import { orders } from "@dashboard/orders/fixtures";
import { OrderListUrlSortField } from "@dashboard/orders/urls";
import React from "react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import { OrderFilterGiftCard } from "./filters";
import OrderListPage, { OrderListPageProps } from "./OrderListPage";

const props: OrderListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...filterPageProps,
  ...sortPageProps,
  filterOpts: {
    preorder: {
      active: false,
      value: false,
    },
    clickAndCollect: {
      active: false,
      value: false,
    },
    channel: {
      active: false,
      value: [],
      choices: [
        {
          label: "Channel PLN",
          value: "channelId",
        },
      ],
    },
    created: {
      active: false,
      value: {
        max: "400",
        min: "50",
      },
    },
    customer: {
      active: false,
      value: "Jesse",
    },
    status: {
      active: false,
      value: [OrderStatusFilter.CANCELED, OrderStatusFilter.FULFILLED],
    },
    paymentStatus: {
      active: false,
      value: [
        PaymentChargeStatusEnum.CANCELLED,
        PaymentChargeStatusEnum.FULLY_CHARGED,
      ],
    },
    giftCard: {
      active: false,
      value: [OrderFilterGiftCard.bought, OrderFilterGiftCard.paid],
    },
    metadata: {
      active: false,
      value: [{ key: "123", value: "123" }, { key: "321" }],
    },
  },
  limits,
  onSettingsOpen: () => undefined,
  orders,
  sort: {
    ...sortPageProps.sort,
    sort: OrderListUrlSortField.number,
  },
  params: {},
  currentTab: 0,
  hasPresetsChanged: false,
  onTabSave: () => undefined,
  onTabUpdate: () => undefined,
};

export default {
  title: "Orders / Order list",
  decorators: [PaginatorContextDecorator],
};

export const Default = () => <OrderListPage {...props} />;

export const Loading = () => (
  <OrderListPage
    {...props}
    orders={undefined}
    currentTab={undefined}
    disabled={true}
  />
);

export const WhenNoData = () => <OrderListPage {...props} orders={[]} />;

export const NoLimits = () => <OrderListPage {...props} limits={undefined} />;

export const LimitsReached = () => (
  <OrderListPage {...props} limits={limitsReached} />
);
