import { IFilter } from "@saleor/components/Filter";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import { OrderStatusFilter, PaymentChargeStatusEnum } from "@saleor/graphql";
import {
  commonMessages,
  commonStatusMessages,
  orderStatusMessages,
  paymentStatusMessages,
} from "@saleor/intl";
import { FilterOpts, KeyValue, MinMax } from "@saleor/types";
import {
  createBooleanField,
  createDateField,
  createKeyValueField,
  createOptionsField,
  createTextField,
} from "@saleor/utils/filters/fields";
import { defineMessages, IntlShape } from "react-intl";

export enum OrderFilterKeys {
  created = "created",
  customer = "customer",
  status = "status",
  paymentStatus = "paymentStatus",
  clickAndCollect = "clickAndCollect",
  preorder = "preorder",
  channel = "channel",
  giftCard = "giftCard",
  metadata = "metadata",
}

export enum OrderFilterGiftCard {
  bought = "bought",
  paid = "paid",
}

export interface OrderListFilterOpts {
  created: FilterOpts<MinMax>;
  customer: FilterOpts<string>;
  status: FilterOpts<OrderStatusFilter[]>;
  paymentStatus: FilterOpts<PaymentChargeStatusEnum[]>;
  channel?: FilterOpts<MultiAutocompleteChoiceType[]>;
  clickAndCollect: FilterOpts<boolean>;
  preorder: FilterOpts<boolean>;
  giftCard: FilterOpts<OrderFilterGiftCard[]>;
  metadata: FilterOpts<KeyValue[]>;
}

const messages = defineMessages({
  preorder: {
    id: "JYvf8/",
    defaultMessage: "Preorder",
    description: "is preorder",
  },
  clickAndCollect: {
    id: "biAxKR",
    defaultMessage: "Click&Collect",
    description: "click and collect",
  },
  channel: {
    id: "lJP1iw",
    defaultMessage: "Channel",
    description: "order",
  },
  customer: {
    id: "PzXIXh",
    defaultMessage: "Customer",
    description: "order",
  },
  placed: {
    id: "a4qX2+",
    defaultMessage: "Created",
    description: "order",
  },
  giftCard: {
    id: "JUQwne",
    defaultMessage: "Gift Card",
    description: "order",
  },
  giftCardPaid: {
    id: "Kgxlsf",
    defaultMessage: "Paid with Gift Card",
    description: "order",
  },
  giftCardOrdered: {
    id: "s5v6m0",
    defaultMessage: "Gift Card ordered",
    description: "order",
  },
  metadata: {
    defaultMessage: "Metadata",
    id: "8Q504V",
  },
});

export function createFilterStructure(
  intl: IntlShape,
  opts: OrderListFilterOpts,
): IFilter<OrderFilterKeys> {
  return [
    {
      ...createBooleanField(
        OrderFilterKeys.clickAndCollect,
        intl.formatMessage(messages.clickAndCollect),
        opts.clickAndCollect.value,
        {
          negative: intl.formatMessage(commonMessages.no),
          positive: intl.formatMessage(commonMessages.yes),
        },
      ),
      active: opts.clickAndCollect.active,
    },
    {
      ...createBooleanField(
        OrderFilterKeys.preorder,
        intl.formatMessage(messages.preorder),
        opts.preorder.value,
        {
          negative: intl.formatMessage(commonMessages.no),
          positive: intl.formatMessage(commonMessages.yes),
        },
      ),
      active: opts.preorder.active,
    },
    {
      ...createTextField(
        OrderFilterKeys.customer,
        intl.formatMessage(messages.customer),
        opts.customer.value,
      ),
      active: opts.customer.active,
    },
    {
      ...createDateField(
        OrderFilterKeys.created,
        intl.formatMessage(messages.placed),
        opts.created.value,
      ),
      active: opts.created.active,
    },
    {
      ...createOptionsField(
        OrderFilterKeys.giftCard,
        intl.formatMessage(messages.giftCard),
        opts.giftCard.value,
        true,
        [
          {
            label: intl.formatMessage(messages.giftCardOrdered),
            value: OrderFilterGiftCard.bought,
          },
          {
            label: intl.formatMessage(messages.giftCardPaid),
            value: OrderFilterGiftCard.paid,
          },
        ],
      ),
      active: opts.giftCard.active,
    },
    {
      ...createOptionsField(
        OrderFilterKeys.status,
        intl.formatMessage(commonMessages.status),
        opts.status.value,
        true,
        [
          {
            label: intl.formatMessage(commonStatusMessages.cancelled),
            value: OrderStatusFilter.CANCELED,
          },
          {
            label: intl.formatMessage(orderStatusMessages.fulfilled),
            value: OrderStatusFilter.FULFILLED,
          },
          {
            label: intl.formatMessage(orderStatusMessages.partiallyFulfilled),
            value: OrderStatusFilter.PARTIALLY_FULFILLED,
          },
          {
            label: intl.formatMessage(orderStatusMessages.unfulfilled),
            value: OrderStatusFilter.UNFULFILLED,
          },
          {
            label: intl.formatMessage(orderStatusMessages.readyToCapture),
            value: OrderStatusFilter.READY_TO_CAPTURE,
          },
          {
            label: intl.formatMessage(orderStatusMessages.readyToFulfill),
            value: OrderStatusFilter.READY_TO_FULFILL,
          },
          {
            label: intl.formatMessage(orderStatusMessages.unconfirmed),
            value: OrderStatusFilter.UNCONFIRMED,
          },
        ],
      ),
      active: opts.status.active,
    },
    {
      ...createOptionsField(
        OrderFilterKeys.paymentStatus,
        intl.formatMessage(commonMessages.paymentStatus),
        opts.paymentStatus.value,
        true,
        [
          {
            label: intl.formatMessage(paymentStatusMessages.paid),
            value: PaymentChargeStatusEnum.FULLY_CHARGED,
          },
          {
            label: intl.formatMessage(paymentStatusMessages.partiallyPaid),
            value: PaymentChargeStatusEnum.PARTIALLY_CHARGED,
          },
          {
            label: intl.formatMessage(paymentStatusMessages.unpaid),
            value: PaymentChargeStatusEnum.NOT_CHARGED,
          },
          {
            label: intl.formatMessage(paymentStatusMessages.refunded),
            value: PaymentChargeStatusEnum.FULLY_REFUNDED,
          },
          {
            label: intl.formatMessage(paymentStatusMessages.partiallyRefunded),
            value: PaymentChargeStatusEnum.PARTIALLY_REFUNDED,
          },
          {
            label: intl.formatMessage(commonStatusMessages.cancelled),
            value: PaymentChargeStatusEnum.CANCELLED,
          },
          {
            label: intl.formatMessage(paymentStatusMessages.pending),
            value: PaymentChargeStatusEnum.PENDING,
          },
          {
            label: intl.formatMessage(paymentStatusMessages.refused),
            value: PaymentChargeStatusEnum.REFUSED,
          },
        ],
      ),
      active: opts.paymentStatus.active,
    },
    {
      ...createKeyValueField(
        OrderFilterKeys.metadata,
        intl.formatMessage(messages.metadata),
        opts.metadata.value,
      ),
      active: opts.metadata.active,
    },
    ...(opts?.channel?.value.length
      ? [
          {
            ...createOptionsField(
              OrderFilterKeys.channel,
              intl.formatMessage(messages.channel),
              [],
              true,
              opts.channel.value,
            ),
            active: opts.channel.active,
          },
        ]
      : []),
  ];
}
