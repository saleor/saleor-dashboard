import { LeftOperand } from "@dashboard/components/ConditionalFilter/LeftOperandsProvider";
import {
  OrderAuthorizeStatusEnum,
  OrderChargeStatusEnum,
  OrderStatusFilter,
  PaymentChargeStatusEnum,
} from "@dashboard/graphql";
import { transformOrderStatus, transformPaymentStatus } from "@dashboard/misc";
import { IntlShape } from "react-intl";

import { authorizeStatusMessages, chargeStatusMessages } from "./messages";

// TODO: INTL
//   switch (status) {
//     case PaymentChargeStatusEnum.FULLY_CHARGED:
//       return "Fully charged";
//     case PaymentChargeStatusEnum.PARTIALLY_CHARGED:
//       return "Partially charged";
//     case PaymentChargeStatusEnum.NOT_CHARGED:
//       return "Not charged";
//     case PaymentChargeStatusEnum.FULLY_REFUNDED:
//       return "Fully refunded";
//     case PaymentChargeStatusEnum.PARTIALLY_REFUNDED:
//       return "Partially refunded";
//     case PaymentChargeStatusEnum.CANCELLED:
//       return "Cancelled";
//     case PaymentChargeStatusEnum.PENDING:
//       return "Pending";
//     case PaymentChargeStatusEnum.REFUSED:
//       return "Refused";
//     default:
//       return status;
//   }
const getPaymentStatusLabel = (status: PaymentChargeStatusEnum, intl: IntlShape) => {
  const { localized } = transformPaymentStatus(status, intl);

  return localized;
};

//   switch (status) {
//     case OrderStatusFilter.READY_TO_FULFILL:
//       return orderStatusMessages.readyToFulfill;
//     case OrderStatusFilter.READY_TO_CAPTURE:
//       return "Ready to capture";
//     case OrderStatusFilter.UNFULFILLED:
//       return "Unfulfilled";
//     case OrderStatusFilter.UNCONFIRMED:
//       return "Unconfirmed";
//     case OrderStatusFilter.PARTIALLY_FULFILLED:
//       return "Partially fulfilled";
//     case OrderStatusFilter.FULFILLED:
//       return "Fulfilled";
//     case OrderStatusFilter.CANCELED:
//       return "Cancelled";
//     default:
//       return status;
//   }
const getOrderStatusLabel = (status: OrderStatusFilter, intl: IntlShape) => {
  const { localized } = transformOrderStatus(status, intl);

  return localized;
};

const getAuthorizeStatusLabel = (status: OrderAuthorizeStatusEnum, intl: IntlShape) => {
  switch (status) {
    case OrderAuthorizeStatusEnum.FULL:
      return intl.formatMessage(authorizeStatusMessages.full);
    case OrderAuthorizeStatusEnum.PARTIAL:
      return intl.formatMessage(authorizeStatusMessages.partial);
    case OrderAuthorizeStatusEnum.NONE:
      return intl.formatMessage(authorizeStatusMessages.none);
    default:
      return status;
  }
};

const getChargeStatusLabel = (status: OrderChargeStatusEnum, intl: IntlShape) => {
  switch (status) {
    case OrderChargeStatusEnum.FULL:
      return intl.formatMessage(chargeStatusMessages.full);
    case OrderChargeStatusEnum.PARTIAL:
      return intl.formatMessage(chargeStatusMessages.partial);
    case OrderChargeStatusEnum.OVERCHARGED:
      return intl.formatMessage(chargeStatusMessages.overcharged);
    case OrderChargeStatusEnum.NONE:
      return intl.formatMessage(chargeStatusMessages.none);
    default:
      return status;
  }
};

export const getLocalizedLabel = (rowType: LeftOperand["type"], value: string, intl: IntlShape) => {
  switch (rowType) {
    case "paymentStatus":
      return getPaymentStatusLabel(value as PaymentChargeStatusEnum, intl);
    case "status":
      return getOrderStatusLabel(value as OrderStatusFilter, intl);
    case "authorizeStatus":
      return getAuthorizeStatusLabel(value as OrderAuthorizeStatusEnum, intl);
    case "chargeStatus":
      return getChargeStatusLabel(value as OrderChargeStatusEnum, intl);
    default:
      return value;
  }
};
