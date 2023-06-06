import { saleList } from "@dashboard/discounts/fixtures";
import { SaleListUrlSortField } from "@dashboard/discounts/urls";
import {
  filterPageProps,
  listActionsProps,
  pageListProps,
  sortPageProps,
  tabPageProps,
} from "@dashboard/fixtures";
import { DiscountStatusEnum, DiscountValueTypeEnum } from "@dashboard/graphql";
import { Meta, StoryObj } from "@storybook/react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import SaleListPage, { SaleListPageProps } from "./SaleListPage";

const props: SaleListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...filterPageProps,
  ...sortPageProps,
  ...tabPageProps,
  filterOpts: {
    channel: {
      active: false,
      value: "default-channel",
      choices: [
        {
          value: "default-channel",
          label: "Default channel",
        },
      ],
    },
    saleType: {
      active: false,
      value: DiscountValueTypeEnum.FIXED,
    },
    started: {
      active: false,
      value: {
        max: undefined,
        min: undefined,
      },
    },
    status: {
      active: false,
      value: [DiscountStatusEnum.ACTIVE],
    },
  },
  sales: saleList,
  selectedChannelId: "123",
  sort: {
    ...sortPageProps.sort,
    sort: SaleListUrlSortField.name,
  },
};

const meta: Meta<typeof SaleListPage> = {
  title: "Discounts / Sale list",
  decorators: [PaginatorContextDecorator],
  component: SaleListPage,
};
export default meta;
type Story = StoryObj<typeof SaleListPage>;

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
    sales: undefined,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const NoData: Story = {
  args: {
    ...props,
    sales: [],
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const NoChannels: Story = {
  args: {
    ...props,
    sales: saleList.map(sale => ({ ...sale, channelListings: [] })),
    selectedChannelId: "",
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};
