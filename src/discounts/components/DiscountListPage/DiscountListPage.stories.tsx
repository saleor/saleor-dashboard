import { SaleListUrlSortField } from "@dashboard/discounts/urls";
import {
  filterPresetsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
} from "@dashboard/fixtures";
import { DiscountStatusEnum, DiscountValueTypeEnum } from "@dashboard/graphql";
import { Meta, StoryObj } from "@storybook/react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import DiscountListPage, { DiscountListPageProps } from "./DiscountListPage";

const props: DiscountListPageProps = {
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  ...filterPresetsProps,
  onFilterChange: () => undefined,
  selectedSaleIds: [],
  onSelectSaleIds: () => {},
  onSalesDelete: () => {},
  settings: {
    ...pageListProps.default.settings,
    columns: ["name", "startDate", "endDate", "value"],
  },
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
        max: "",
        min: "",
      },
    },
    status: {
      active: false,
      value: [DiscountStatusEnum.ACTIVE],
    },
  },
  promotions: [],
  selectedChannelId: "123",
  sort: {
    ...sortPageProps.sort,
    sort: SaleListUrlSortField.name,
  },
};

const meta: Meta<typeof DiscountListPage> = {
  title: "Discounts / Sale list",
  decorators: [PaginatorContextDecorator],
  component: DiscountListPage,
};
export default meta;
type Story = StoryObj<typeof DiscountListPage>;

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
    promotions: undefined,
    disabled: true,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const NoData: Story = {
  args: {
    ...props,
    promotions: [],
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const NoChannels: Story = {
  args: {
    ...props,
    // promotions: saleList.map(sale => ({ ...sale, channelListings: [] })),
    promotions: [],
    selectedChannelId: "",
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};
