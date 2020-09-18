import { VoucherListUrlSortField } from "@saleor/discounts/urls";
import {
  DiscountStatusEnum,
  VoucherDiscountType
} from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import VoucherListPage, {
  VoucherListPageProps
} from "../../../discounts/components/VoucherListPage";
import { voucherList } from "../../../discounts/fixtures";
import {
  filterPageProps,
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps
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
