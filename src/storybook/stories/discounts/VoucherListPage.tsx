import { storiesOf } from "@storybook/react";
import React from "react";

import { VoucherListUrlSortField } from "@saleor/discounts/urls";
import {
  VoucherDiscountType,
  DiscountStatusEnum
} from "@saleor/types/globalTypes";
import VoucherListPage, {
  VoucherListPageProps
} from "../../../discounts/components/VoucherListPage";
import { voucherList } from "../../../discounts/fixtures";
import {
  listActionsProps,
  pageListProps,
  searchPageProps,
  tabPageProps,
  sortPageProps,
  filterPageProps
} from "../../../fixtures";
import Decorator from "../../Decorator";

const props: VoucherListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  ...tabPageProps,
  ...filterPageProps,
  defaultCurrency: "USD",
  filterOpts: {
    saleType: {
      active: false,
      value: [VoucherDiscountType.FIXED, VoucherDiscountType.PERCENTAGE]
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
    },
    timesUsed: {
      active: false,
      value: {
        max: undefined,
        min: undefined
      }
    }
  },
  sort: {
    ...sortPageProps.sort,
    sort: VoucherListUrlSortField.code
  },
  vouchers: voucherList
};

storiesOf("Views / Discounts / Voucher list", module)
  .addDecorator(Decorator)
  .add("default", () => <VoucherListPage {...props} />)
  .add("loading", () => <VoucherListPage {...props} vouchers={undefined} />)
  .add("no data", () => <VoucherListPage {...props} vouchers={[]} />);
