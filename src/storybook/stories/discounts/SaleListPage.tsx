import { SaleListUrlSortField } from "@saleor/discounts/urls";
import { DiscountStatusEnum, DiscountValueTypeEnum } from "@saleor/graphql";
import { PaginatorContextDecorator } from "@saleor/storybook/PaginatorContextDecorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import SaleListPage, {
  SaleListPageProps,
} from "../../../discounts/components/SaleListPage";
import { saleList } from "../../../discounts/fixtures";
import {
  filterPageProps,
  listActionsProps,
  pageListProps,
  sortPageProps,
  tabPageProps,
} from "../../../fixtures";
import Decorator from "../../Decorator";

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

storiesOf("Views / Discounts / Sale list", module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add("default", () => <SaleListPage {...props} />)
  .add("loading", () => <SaleListPage {...props} sales={undefined} />)
  .add("no data", () => <SaleListPage {...props} sales={[]} />)
  .add("no channels", () => (
    <SaleListPage
      {...props}
      sales={saleList.map(sale => ({ ...sale, channelListings: [] }))}
      selectedChannelId=""
    />
  ));
