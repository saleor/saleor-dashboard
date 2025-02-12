import { LeftOperand } from "@dashboard/components/ConditionalFilter/LeftOperandsProvider";
import {
  CollectionPublished,
  DiscountStatusEnum,
  OrderAuthorizeStatusEnum,
  OrderChargeStatusEnum,
  OrderStatusFilter,
  PaymentChargeStatusEnum,
  VoucherDiscountType,
} from "@dashboard/graphql";
import { transformOrderStatus, transformPaymentStatus } from "@dashboard/misc";
import { IntlShape } from "react-intl";

import {
  authorizeStatusMessages,
  chargeStatusMessages,
  collectionFilterMessages,
  discountTypeMessages,
  voucherStatusMessages,
} from "./messages";

const getPaymentStatusLabel = (status: PaymentChargeStatusEnum, intl: IntlShape) => {
  const { localized } = transformPaymentStatus(status, intl);

  return localized;
};

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

const getDiscountTypeLabel = (type: VoucherDiscountType, intl: IntlShape) => {
  switch (type) {
    case VoucherDiscountType.FIXED:
      return intl.formatMessage(discountTypeMessages.fixed);
    case VoucherDiscountType.PERCENTAGE:
      return intl.formatMessage(discountTypeMessages.percentage);
    case VoucherDiscountType.SHIPPING:
      return intl.formatMessage(discountTypeMessages.shipping);
  }
};

const getVoucherStatusLabel = (status: DiscountStatusEnum, intl: IntlShape) => {
  switch (status) {
    case DiscountStatusEnum.ACTIVE:
      return intl.formatMessage(voucherStatusMessages.active);
    case DiscountStatusEnum.EXPIRED:
      return intl.formatMessage(voucherStatusMessages.expired);
    case DiscountStatusEnum.SCHEDULED:
      return intl.formatMessage(voucherStatusMessages.scheduled);
    default:
      return status;
  }
};

const getPublishedLabel = (status: CollectionPublished, intl: IntlShape) => {
  switch (status) {
    case CollectionPublished.PUBLISHED:
      return intl.formatMessage(collectionFilterMessages.published);
    case CollectionPublished.HIDDEN:
      return intl.formatMessage(collectionFilterMessages.hidden);
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
    case "published":
      return getPublishedLabel(value as CollectionPublished, intl);
    case "discountType":
      return getDiscountTypeLabel(value as VoucherDiscountType, intl);
    case "voucherStatus":
      return getVoucherStatusLabel(value as DiscountStatusEnum, intl);
    default:
      return value;
  }
};
