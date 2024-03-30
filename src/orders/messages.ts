import { defineMessages } from "react-intl";

import { TransactionEventType } from "./types";

export const orderMessages = defineMessages({
  headerOrder: {
    id: "Ljtqmt",
    defaultMessage: "Order",
    description: "page header, order id unknown",
  },
  headerOrderNumber: {
    id: "kPIZ65",
    defaultMessage: "Order #{orderNumber}",
    description: "page header",
  },
  filterPresetsAll: {
    defaultMessage: "All orders",
    id: "lNZuWl",
  },
});

export const orderDiscountTypeLabelMessages = defineMessages({
  staffAdded: {
    id: "QJG+d/",
    defaultMessage: "Staff added",
    description: "staff added type order discount",
  },
  voucher: {
    id: "sEjRyz",
    defaultMessage: "Voucher",
    description: "voucher type order discount",
  },
  promotion: {
    id: "TBdxTP",
    defaultMessage: "Promotion",
    description: "promotion type order discount",
  },
});

export const transactionEventTypeMap = defineMessages<
  Exclude<TransactionEventType, "INFO">
>({
  AUTHORIZATION: {
    defaultMessage: "Authorization",
    id: "qtF0Ft",
    description:
      "transaction event type, amount was authorized, but not captured",
  },
  CHARGE: {
    defaultMessage: "Capture",
    id: "f2WJW7",
    description: "transaction event type, amount was captured from client",
  },
  CANCEL: {
    defaultMessage: "Cancel",
    id: "TLDkvR",
    description: "transaction event type, transaction was cancelled / voided",
  },
  REFUND: {
    defaultMessage: "Refund",
    id: "l3iOju",
    description: "transaction event type, transaction was refunded to client",
  },
  CHARGEBACK: {
    defaultMessage: "Chargeback",
    id: "DVgMit",
    description:
      "transaction event type, transaction was chargeback by payment provider",
  },
  AUTHORIZATION_ADJUSTMENT: {
    defaultMessage: "Authorization amount adjusted",
    id: "E1C9pp",
    description: "transaction event type, authorization amount was changed",
  },
  REFUND_REVERSED: {
    defaultMessage: "Refund reversed",
    id: "of/+iV",
    description:
      "transaction event type, refund was reversed, funds are back to store account",
  },
});
