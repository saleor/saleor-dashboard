import { voucherList } from "@dashboard/discounts/fixtures";
import { VoucherListUrlSortField } from "@dashboard/discounts/urls";
import {
  filterPageProps,
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps,
} from "@dashboard/fixtures";
import { DiscountStatusEnum, VoucherDiscountType } from "@dashboard/graphql";
import React from "react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import VoucherListPage, { VoucherListPageProps } from "./VoucherListPage";

const props: VoucherListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  ...tabPageProps,
  ...filterPageProps,
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
};

export default {
  title: "Discounts / Voucher list",
  decorators: [PaginatorContextDecorator],
};

export const Default = () => <VoucherListPage {...props} />;

export const Loading = () => (
  <VoucherListPage {...props} vouchers={undefined} />
);

export const NoChannels = () => (
  <VoucherListPage
    {...props}
    selectedChannelId=""
    vouchers={voucherList.map(voucher => ({
      ...voucher,
      channelListings: [],
    }))}
  />
);
