import { TransactionEventActionTypeEnum } from "@saleor/graphql";
import { defineMessages } from "react-intl";

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
});

export const transactionEventTypeMap = defineMessages<
  TransactionEventActionTypeEnum
>({
  AUTHORIZE: {
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
});
