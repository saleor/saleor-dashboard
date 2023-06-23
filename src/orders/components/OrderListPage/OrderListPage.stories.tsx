// @ts-strict-ignore
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
import { Meta, StoryObj } from "@storybook/react";

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

const meta: Meta<typeof OrderListPage> = {
  title: "Orders / Order list",
  decorators: [PaginatorContextDecorator],
  component: OrderListPage,
};
export default meta;
type Story = StoryObj<typeof OrderListPage>;

export const Default: Story = {
  args: {
    ...props,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const Loading: Story = {
  args: {
    ...props,
    orders: undefined,
    currentTab: undefined,
    disabled: true,
  },
  parameters: {
    chromatic: { diffThreshold: 0.9, pauseAnimationAtEnd: true },
  },
};

export const WhenNoData: Story = {
  args: {
    ...props,
    orders: [],
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const NoLimits: Story = {
  args: {
    ...props,
    limits: undefined,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const LimitsReached: Story = {
  args: {
    ...props,
    limits: limitsReached,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};
