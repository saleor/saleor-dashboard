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
import React from "react";

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

export default {
  title: "Discounts / Sale list",
  decorators: [PaginatorContextDecorator],
};

export const Default = () => <SaleListPage {...props} />;

export const Loading = () => <SaleListPage {...props} sales={undefined} />;

export const NoData = () => <SaleListPage {...props} sales={[]} />;

export const NoChannels = () => (
  <SaleListPage
    {...props}
    sales={saleList.map(sale => ({ ...sale, channelListings: [] }))}
    selectedChannelId=""
  />
);
