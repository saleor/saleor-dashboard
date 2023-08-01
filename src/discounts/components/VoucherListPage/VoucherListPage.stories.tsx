// @ts-strict-ignore
import { voucherList } from "@dashboard/discounts/fixtures";
import { VoucherListUrlSortField } from "@dashboard/discounts/urls";
import {
  filterPresetsProps,
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
} from "@dashboard/fixtures";
import { DiscountStatusEnum, VoucherDiscountType } from "@dashboard/graphql";
import { Meta, StoryObj } from "@storybook/react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import VoucherListPage, { VoucherListPageProps } from "./VoucherListPage";

const props: VoucherListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  ...filterPresetsProps,
  onSelectVouchersIds: () => undefined,
  selectedVouchersIds: [],
  onVoucherDelete: () => undefined,
  onFilterChange: () => undefined,
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
      value: [VoucherDiscountType.FIXED, VoucherDiscountType.PERCENTAGE],
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
    timesUsed: {
      active: false,
      value: {
        max: undefined,
        min: undefined,
      },
    },
  },
  selectedChannelId: "123",
  sort: {
    ...sortPageProps.sort,
    sort: VoucherListUrlSortField.code,
  },
  vouchers: voucherList,
  settings: {
    rowNumber: 20,
    columns: ["code", "min-spent", "start-date", "end-date", "value", "limit"],
  },
};

const meta: Meta<typeof VoucherListPage> = {
  title: "Discounts / Voucher list",
  decorators: [PaginatorContextDecorator],
  component: VoucherListPage,
};
export default meta;
type Story = StoryObj<typeof VoucherListPage>;

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
    vouchers: undefined,
    disabled: true,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const NoChannels: Story = {
  args: {
    ...props,
    selectedChannelId: "",
    vouchers: voucherList.map(voucher => ({
      ...voucher,
      channelListings: [],
    })),
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};
