import { LeftOperand } from "@dashboard/components/ConditionalFilter/LeftOperandsProvider";
import {
  AttributeTypeEnum,
  OrderAuthorizeStatusEnum,
  OrderChargeStatusEnum,
  OrderStatusFilter,
  PaymentChargeStatusEnum,
} from "@dashboard/graphql";
import { transformOrderStatus, transformPaymentStatus } from "@dashboard/misc";
import { IntlShape } from "react-intl";

import { attributeTypeMessages, authorizeStatusMessages, chargeStatusMessages } from "./messages";

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

const getAttributeTypeLabel = (type: AttributeTypeEnum, intl: IntlShape) => {
  switch (type) {
    case AttributeTypeEnum.PAGE_TYPE:
      return intl.formatMessage(attributeTypeMessages.pageType);
    case AttributeTypeEnum.PRODUCT_TYPE:
      return intl.formatMessage(attributeTypeMessages.productType);
    default:
      return type;
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
    case "attributeType":
      return getAttributeTypeLabel(value as AttributeTypeEnum, intl);
    default:
      return value;
  }
};
