import OrderListPage, {
  OrderListPageProps
} from "@saleor/orders/components/OrderListPage";
import { OrderListUrlSortField } from "@saleor/orders/urls";
import {
  OrderStatusFilter,
  PaymentChargeStatusEnum
} from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import {
  filterPageProps,
  limits,
  limitsReached,
  listActionsProps,
  pageListProps,
  sortPageProps
} from "../../../fixtures";
import { orders } from "../../../orders/fixtures";
import Decorator from "../../Decorator";

const props: OrderListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...filterPageProps,
  ...sortPageProps,
  filterOpts: {
    channel: {
      active: false,
      value: [
        {
          label: "Channel PLN",
          value: "channelId"
        }
      ]
    },
    created: {
      active: false,
      value: {
        max: "400",
        min: "50"
      }
    },
    customer: {
      active: false,
      value: "Jesse"
    },
    status: {
      active: false,
      value: [OrderStatusFilter.CANCELED, OrderStatusFilter.FULFILLED]
    },
    paymentStatus: {
      active: false,
      value: [
        PaymentChargeStatusEnum.CANCELLED,
        PaymentChargeStatusEnum.FULLY_CHARGED
      ]
    }
  },
  limits,
  onSettingsOpen: () => undefined,
  orders,
  sort: {
    ...sortPageProps.sort,
    sort: OrderListUrlSortField.number
  }
};

storiesOf("Views / Orders / Order list", module)
  .addDecorator(Decorator)
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
