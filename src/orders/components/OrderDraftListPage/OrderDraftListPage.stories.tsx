// @ts-strict-ignore
import {
  filterPageProps,
  filterPresetsProps,
  limits,
  limitsReached,
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps,
} from "@dashboard/fixtures";
import { OrderDraftListUrlSortField } from "@dashboard/orders/urls";
import { Meta, StoryObj } from "@storybook/react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import { orders } from "../../fixtures";
import OrderDraftListPage, {
  OrderDraftListPageProps,
} from "./OrderDraftListPage";

const props: OrderDraftListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...searchPageProps,
  ...filterPresetsProps,
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
  onDraftOrdersDelete: () => undefined,
  onSelectOrderDraftIds: () => undefined,
  selectedOrderDraftIds: [],
  hasPresetsChanged: () => false,
};

const meta: Meta<typeof OrderDraftListPage> = {
  title: "Orders / Draft order list",
  decorators: [PaginatorContextDecorator],
  component: OrderDraftListPage,
};
export default meta;
type Story = StoryObj<typeof OrderDraftListPage>;

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
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
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

export const LimitsReached: Story = {
  args: {
    ...props,
    limits: limitsReached,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};
