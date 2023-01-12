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
import Decorator from "@dashboard/storybook/Decorator";
import { PaginatorContextDecorator } from "@dashboard/storybook/PaginatorContextDecorator";
import { storiesOf } from "@storybook/react";
import React from "react";

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
      value: [
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
};

storiesOf("Orders / Order list", module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add("default", () => <OrderListPage {...props} />)
  .add("loading", () => (
    <OrderListPage
      {...props}
      orders={undefined}
      currentTab={undefined}
      disabled={true}
    />
  ))
  .add("when no data", () => <OrderListPage {...props} orders={[]} />)
  .add("no limits", () => <OrderListPage {...props} limits={undefined} />)
  .add("limits reached", () => (
    <OrderListPage {...props} limits={limitsReached} />
  ));
