import { IFilter } from "@saleor/components/Filter";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import { DiscountStatusEnum, VoucherDiscountType } from "@saleor/graphql";
import { FilterOpts, MinMax } from "@saleor/types";
import {
  createDateField,
  createNumberField,
  createOptionsField,
} from "@saleor/utils/filters/fields";
import { defineMessages, IntlShape } from "react-intl";

export enum VoucherFilterKeys {
  saleType = "saleType",
  started = "started",
  status = "status",
  timesUsed = "timesUsed",
  channel = "channel",
}

export interface VoucherListFilterOpts {
  saleType: FilterOpts<VoucherDiscountType[]>;
  started: FilterOpts<MinMax>;
  status: FilterOpts<DiscountStatusEnum[]>;
  timesUsed: FilterOpts<MinMax>;
  channel: FilterOpts<string> & { choices: MultiAutocompleteChoiceType[] };
}

const messages = defineMessages({
  active: {
    id: "amQg6f",
    defaultMessage: "Active",
    description: "voucher status",
  },
  channel: {
    id: "NLybdq",
    defaultMessage: "Channel",
    description: "voucher channel",
  },
  expired: {
    id: "t7UwLY",
    defaultMessage: "Expired",
    description: "voucher status",
  },
  fixed: {
    id: "XDBeA+",
    defaultMessage: "Fixed amount",
    description: "discount type",
  },
  percentage: {
    id: "s17U7u",
    defaultMessage: "Percentage",
    description: "discount type",
  },
  scheduled: {
    id: "Jj0de8",
    defaultMessage: "Scheduled",
    description: "voucher status",
  },
  started: {
    id: "ujFo4A",
    defaultMessage: "Started",
    description: "voucher start date",
  },
  status: {
    id: "uy+tB8",
    defaultMessage: "Status",
    description: "voucher status",
  },
  timesUsed: {
    id: "h75GAF",
    defaultMessage: "Times used",
    description: "voucher",
  },
  type: {
    id: "KHZlmi",
    defaultMessage: "Discount Type",
  },
});

export function createFilterStructure(
  intl: IntlShape,
  opts: VoucherListFilterOpts,
): IFilter<VoucherFilterKeys> {
  return [
    {
      ...createOptionsField(
        VoucherFilterKeys.channel,
        intl.formatMessage(messages.channel),
        [opts.channel.value],
        false,
        opts.channel.choices,
      ),
      active: opts.channel.active,
    },
    {
      ...createDateField(
        VoucherFilterKeys.started,
        intl.formatMessage(messages.started),
        opts.started.value,
      ),
      active: opts.started.active,
    },
    {
      ...createNumberField(
        VoucherFilterKeys.timesUsed,
        intl.formatMessage(messages.timesUsed),
        opts.timesUsed.value,
      ),
      active: opts.timesUsed.active,
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
            value: DiscountStatusEnum.ACTIVE,
          },
          {
            label: intl.formatMessage(messages.expired),
            value: DiscountStatusEnum.EXPIRED,
          },
          {
            label: intl.formatMessage(messages.scheduled),
            value: DiscountStatusEnum.SCHEDULED,
          },
        ],
      ),
      active: opts.status.active,
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
            value: VoucherDiscountType.FIXED,
          },
          {
            label: intl.formatMessage(messages.percentage),
            value: VoucherDiscountType.PERCENTAGE,
          },
          {
            label: intl.formatMessage(messages.percentage),
            value: VoucherDiscountType.SHIPPING,
          },
        ],
      ),
      active: opts.saleType.active,
    },
  ];
}
