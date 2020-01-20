import { defineMessages, IntlShape } from "react-intl";

import { FilterOpts, MinMax } from "@saleor/types";
import {
  DiscountStatusEnum,
  DiscountValueTypeEnum
} from "@saleor/types/globalTypes";
import {
  createDateField,
  createOptionsField
} from "@saleor/utils/filters/fields";
import { IFilter } from "@saleor/components/Filter";

export enum SaleFilterKeys {
  saleType = "saleType",
  started = "started",
  status = "status"
}

export interface SaleListFilterOpts {
  saleType: FilterOpts<DiscountValueTypeEnum>;
  started: FilterOpts<MinMax>;
  status: FilterOpts<DiscountStatusEnum[]>;
}

const messages = defineMessages({
  active: {
    defaultMessage: "Active",
    description: "sale status"
  },
  expired: {
    defaultMessage: "Expired",
    description: "sale status"
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
    description: "sale status"
  },
  started: {
    defaultMessage: "Started",
    description: "sale start date"
  },
  status: {
    defaultMessage: "Status",
    description: "sale status"
  },
  type: {
    defaultMessage: "Discount Type"
  }
});

export function createFilterStructure(
  intl: IntlShape,
  opts: SaleListFilterOpts
): IFilter<SaleFilterKeys> {
  return [
    {
      ...createDateField(
        SaleFilterKeys.started,
        intl.formatMessage(messages.started),
        opts.started.value
      ),
      active: opts.started.active
    },
    {
      ...createOptionsField(
        SaleFilterKeys.status,
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
        SaleFilterKeys.saleType,
        intl.formatMessage(messages.type),
        [opts.saleType.value],
        false,
        [
          {
            label: intl.formatMessage(messages.fixed),
            value: DiscountValueTypeEnum.FIXED
          },
          {
            label: intl.formatMessage(messages.percentage),
            value: DiscountValueTypeEnum.PERCENTAGE
          }
        ]
      ),
      active: opts.saleType.active
    }
  ];
}
