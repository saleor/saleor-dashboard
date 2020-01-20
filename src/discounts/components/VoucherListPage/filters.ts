import { defineMessages, IntlShape } from "react-intl";

import {
  createOptionsField,
  createNumberField,
  createDateField
} from "@saleor/utils/filters/fields";
import {
  VoucherDiscountType,
  DiscountStatusEnum
} from "@saleor/types/globalTypes";
import { MinMax, FilterOpts } from "@saleor/types";
import { IFilter } from "@saleor/components/Filter";

export enum VoucherFilterKeys {
  saleType = "saleType",
  started = "started",
  status = "status",
  timesUsed = "timesUsed"
}

export interface VoucherListFilterOpts {
  saleType: FilterOpts<VoucherDiscountType[]>;
  started: FilterOpts<MinMax>;
  status: FilterOpts<DiscountStatusEnum[]>;
  timesUsed: FilterOpts<MinMax>;
}

const messages = defineMessages({
  active: {
    defaultMessage: "Active",
    description: "voucher status"
  },
  expired: {
    defaultMessage: "Expired",
    description: "voucher status"
  },
  fixed: {
    defaultMessage: "Fixed amount",
    description: "discount type"
  },
  percentage: {
    defaultMessage: "Percentage",
    description: "discount type"
  },
  scheduled: {
    defaultMessage: "Scheduled",
    description: "voucher status"
  },
  started: {
    defaultMessage: "Started",
    description: "voucher start date"
  },
  status: {
    defaultMessage: "Status",
    description: "voucher status"
  },
  timesUsed: {
    defaultMessage: "Times used",
    description: "voucher"
  },
  type: {
    defaultMessage: "Discount Type"
  }
});

export function createFilterStructure(
  intl: IntlShape,
  opts: VoucherListFilterOpts
): IFilter<VoucherFilterKeys> {
  return [
    {
      ...createDateField(
        VoucherFilterKeys.started,
        intl.formatMessage(messages.started),
        opts.started.value
      ),
      active: opts.started.active
    },
    {
      ...createNumberField(
        VoucherFilterKeys.timesUsed,
        intl.formatMessage(messages.timesUsed),
        opts.timesUsed.value
      ),
      active: opts.timesUsed.active
    },
    {
      ...createOptionsField(
        VoucherFilterKeys.status,
        intl.formatMessage(messages.status),
        opts.status.value,
        true,
        [
          {
            label: intl.formatMessage(messages.active),
            value: DiscountStatusEnum.ACTIVE
          },
          {
            label: intl.formatMessage(messages.expired),
            value: DiscountStatusEnum.EXPIRED
          },
          {
            label: intl.formatMessage(messages.scheduled),
            value: DiscountStatusEnum.SCHEDULED
          }
        ]
      ),
      active: opts.status.active
    },
    {
      ...createOptionsField(
        VoucherFilterKeys.saleType,
        intl.formatMessage(messages.type),
        opts.saleType.value,
        false,
        [
          {
            label: intl.formatMessage(messages.fixed),
            value: VoucherDiscountType.FIXED
          },
          {
            label: intl.formatMessage(messages.percentage),
            value: VoucherDiscountType.PERCENTAGE
          },
          {
            label: intl.formatMessage(messages.percentage),
            value: VoucherDiscountType.SHIPPING
          }
        ]
      ),
      active: opts.saleType.active
    }
  ];
}
