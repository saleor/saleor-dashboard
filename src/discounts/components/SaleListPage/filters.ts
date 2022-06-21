import { IFilter } from "@saleor/components/Filter";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import { DiscountStatusEnum, DiscountValueTypeEnum } from "@saleor/graphql";
import { FilterOpts, MinMax } from "@saleor/types";
import {
  createDateField,
  createOptionsField,
} from "@saleor/utils/filters/fields";
import { defineMessages, IntlShape } from "react-intl";

export enum SaleFilterKeys {
  saleType = "saleType",
  started = "started",
  status = "status",
  channel = "channel",
}

export interface SaleListFilterOpts {
  saleType: FilterOpts<DiscountValueTypeEnum>;
  started: FilterOpts<MinMax>;
  status: FilterOpts<DiscountStatusEnum[]>;
  channel: FilterOpts<string> & { choices: MultiAutocompleteChoiceType[] };
}

const messages = defineMessages({
  active: {
    id: "AnqH4p",
    defaultMessage: "Active",
    description: "sale status",
  },
  channel: {
    id: "1BNKCZ",
    defaultMessage: "Channel",
    description: "sale channel",
  },
  expired: {
    id: "RBxYJf",
    defaultMessage: "Expired",
    description: "sale status",
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
    id: "BanAhF",
    defaultMessage: "Scheduled",
    description: "sale status",
  },
  started: {
    id: "zjHH6b",
    defaultMessage: "Started",
    description: "sale start date",
  },
  status: {
    id: "SpngiS",
    defaultMessage: "Status",
    description: "sale status",
  },
  type: {
    id: "KHZlmi",
    defaultMessage: "Discount Type",
  },
});

export function createFilterStructure(
  intl: IntlShape,
  opts: SaleListFilterOpts,
): IFilter<SaleFilterKeys> {
  return [
    {
      ...createOptionsField(
        SaleFilterKeys.channel,
        intl.formatMessage(messages.channel),
        [opts.channel.value],
        false,
        opts.channel.choices,
      ),
      active: opts.channel.active,
    },
    {
      ...createDateField(
        SaleFilterKeys.started,
        intl.formatMessage(messages.started),
        opts.started.value,
      ),
      active: opts.started.active,
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
        SaleFilterKeys.saleType,
        intl.formatMessage(messages.type),
        [opts.saleType.value],
        false,
        [
          {
            label: intl.formatMessage(messages.fixed),
            value: DiscountValueTypeEnum.FIXED,
          },
          {
            label: intl.formatMessage(messages.percentage),
            value: DiscountValueTypeEnum.PERCENTAGE,
          },
        ],
      ),
      active: opts.saleType.active,
    },
  ];
}
