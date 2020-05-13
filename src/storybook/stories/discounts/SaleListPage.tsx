import { SaleListUrlSortField } from "@saleor/discounts/urls";
import {
  DiscountStatusEnum,
  DiscountValueTypeEnum
} from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import SaleListPage, {
  SaleListPageProps
} from "../../../discounts/components/SaleListPage";
import { saleList } from "../../../discounts/fixtures";
import {
  filterPageProps,
  listActionsProps,
  pageListProps,
  sortPageProps,
  tabPageProps
} from "../../../fixtures";
import Decorator from "../../Decorator";

const props: SaleListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...filterPageProps,
  ...sortPageProps,
  ...tabPageProps,
  defaultCurrency: "USD",
  filterOpts: {
    saleType: {
      active: false,
      value: DiscountValueTypeEnum.FIXED
    },
    started: {
      active: false,
      value: {
        max: undefined,
        min: undefined
      }
    },
    status: {
      active: false,
      value: [DiscountStatusEnum.ACTIVE]
    }
  },
  sales: saleList,
  sort: {
    ...sortPageProps.sort,
    sort: SaleListUrlSortField.name
  }
};

storiesOf("Views / Discounts / Sale list", module)
  .addDecorator(Decorator)
  .add("default", () => <SaleListPage {...props} />)
  .add("loading", () => <SaleListPage {...props} sales={undefined} />)
  .add("no data", () => <SaleListPage {...props} sales={[]} />);
