import { defineMessages } from "react-intl";

export const messages = defineMessages({
  channelName: {
    id: "UymotP",
    defaultMessage: "Channel name",
    description: "channel name",
  },
  channelSlug: {
    id: "74Zo/H",
    defaultMessage: "Slug",
    description: "channel slug",
  },
  channelSettings: {
    id: "3y4r+z",
    defaultMessage: "Channel Settings",
    description: "channel settings",
  },
  channelCurrency: {
    id: "9Sz0By",
    defaultMessage: "Currency",
    description: "channel currency",
  },
  selectedCurrency: {
    id: "39yi8w",
    defaultMessage: "Selected currency",
    description: "selected currency",
  },
  defaultCountry: {
    id: "tV+Dcm",
    defaultMessage: "Default country",
  },
  orderExpiration: {
    id: "kVKTwC",
    defaultMessage: "Order expiration",
    description: "order expiration card title",
  },
  orderExpirationDescription: {
    id: "U+79k0",
    defaultMessage:
      "The time in days after expired orders will be deleted. Allowed range between 1 and 120.",
    description: "order expiration card description",
  },
  markAsPaid: {
    id: "L2tvTm",
    defaultMessage: "Use Transaction flow when marking order as paid",
    description: "mark as paid strategy checkbox label",
  },
  allowUnpaidOrdersLabel: {
    id: "fuFCpI",
    defaultMessage: "Allow unpaid orders",
    description: "allow unpaid orders checkbox label",
  },
  allowUnpaidOrdersDescription: {
    id: "8iUzOU",
    defaultMessage:
      "Enables completing checkout with order before a successful payment.",
    description: "allow unpaid orders checbkox description",
  },
  defaultTransactionFlowStrategyLabel: {
    id: '/bhtiu',
    defaultMessage: "Processed transaction should be only authorized",
    description: "Processed transaction should be only authorized",
  },
  defaultTransactionFlowStrategyDescription: {
    id: 'rMD49q',
    defaultMessage:
      "Changes transaction strategy flow. By default transactions are always charged. Checking this on, will make transactions to be only authorized.",
    description: "Changes transaction strategy flow",
  },
});
