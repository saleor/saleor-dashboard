import { OrderErrorCode, OrderErrorFragment } from "@saleor/graphql";
import { defineMessages, IntlShape } from "react-intl";

import { getCommonFormFieldErrorMessage } from "./common";

const messages = defineMessages({
  billingNotSet: {
    id: "IFWHn0",
    defaultMessage: "Billing address is not set",
    description: "error message",
  },
  cannotCancelFulfillment: {
    id: "ij7olm",
    defaultMessage: "This fulfillment cannot be cancelled",
    description: "error message",
  },
  cannotCancelOrder: {
    id: "BM1JiJ",
    defaultMessage: "This order cannot be cancelled",
    description: "error message",
  },
  cannotFulfillLine: {
    id: "nOo0oL",
    defaultMessage: "Not enough items to fulfill",
    description: "error message",
  },
  cannotRefund: {
    id: "Xb6BJ9",
    defaultMessage: "Manual payments can not be refunded",
    description: "error message",
  },
  cannotVoid: {
    id: "sZ27WU",
    defaultMessage: "Only pre-authorized payments can be voided",
    description: "error message",
  },
  captureInactive: {
    id: "gKdGxP",
    defaultMessage: "Only pre-authorized payments can be captured",
    description: "error message",
  },
  insufficientStock: {
    id: "d9UqaJ",
    defaultMessage: "Cannot change the quantity because of insufficient stock",
    description: "error message",
  },
  noShippingAddress: {
    id: "Wlc67M",
    defaultMessage:
      "Cannot choose a shipping method for an order without the shipping address",
    description: "error message",
  },
  notEditable: {
    id: "r+8q4B",
    defaultMessage: "Only draft orders can be edited",
    description: "error message",
  },
  paymentMissing: {
    id: "Y1B0PN",
    defaultMessage: "There's no payment associated with the order",
    description: "error message",
  },
  shippingNotApplicable: {
    id: "VEE4gD",
    defaultMessage: "Shipping method is not valid for chosen shipping address",
    description: "error message",
  },
  shippingRequired: {
    id: "ychKsb",
    defaultMessage: "Shipping method is required for this order",
    description: "error message",
  },
});

function getOrderErrorMessage(
  err: OrderErrorFragment,
  intl: IntlShape,
): string {
  if (err) {
    switch (err.code) {
      case OrderErrorCode.BILLING_ADDRESS_NOT_SET:
        return intl.formatMessage(messages.billingNotSet);
      case OrderErrorCode.CANNOT_CANCEL_FULFILLMENT:
        return intl.formatMessage(messages.cannotCancelFulfillment);
      case OrderErrorCode.CANNOT_CANCEL_ORDER:
        return intl.formatMessage(messages.cannotCancelOrder);
      case OrderErrorCode.CANNOT_REFUND:
        return intl.formatMessage(messages.cannotRefund);
      case OrderErrorCode.CAPTURE_INACTIVE_PAYMENT:
        return intl.formatMessage(messages.captureInactive);
      case OrderErrorCode.FULFILL_ORDER_LINE:
        return intl.formatMessage(messages.cannotFulfillLine);
      case OrderErrorCode.INSUFFICIENT_STOCK:
        return intl.formatMessage(messages.insufficientStock);
      case OrderErrorCode.NOT_EDITABLE:
        return intl.formatMessage(messages.notEditable);
      case OrderErrorCode.ORDER_NO_SHIPPING_ADDRESS:
        return intl.formatMessage(messages.noShippingAddress);
      case OrderErrorCode.PAYMENT_MISSING:
        return intl.formatMessage(messages.paymentMissing);
      case OrderErrorCode.SHIPPING_METHOD_NOT_APPLICABLE:
        return intl.formatMessage(messages.shippingNotApplicable);
      case OrderErrorCode.SHIPPING_METHOD_REQUIRED:
        return intl.formatMessage(messages.shippingRequired);
      case OrderErrorCode.VOID_INACTIVE_PAYMENT:
        return intl.formatMessage(messages.cannotVoid);
    }
  }

  return getCommonFormFieldErrorMessage(err, intl);
}

export default getOrderErrorMessage;
