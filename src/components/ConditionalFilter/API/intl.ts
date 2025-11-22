import { LeftOperand } from "@dashboard/components/ConditionalFilter/LeftOperandsProvider";
import {
  AttributeTypeEnum,
  CollectionPublished,
  DiscountStatusEnum,
  FulfillmentStatus,
  OrderAuthorizeStatusEnum,
  OrderChargeStatusEnum,
  OrderStatusFilter,
  PaymentMethodTypeEnum,
  ProductTypeEnum,
  StaffMemberStatus,
  VoucherDiscountType,
} from "@dashboard/graphql";
import { transformOrderStatus } from "@dashboard/misc";
import { IntlShape } from "react-intl";

import {
  attributeTypesMessages,
  authorizeStatusMessages,
  chargeStatusMessages,
  collectionFilterMessages,
  discountTypeMessages,
  fulfillmentStatusMessages,
  paymentMethodTypeMessages,
  productTypeMessages,
  staffMembersStatusMessages,
  voucherStatusMessages,
} from "./messages";

const getOrderStatusLabel = (status: OrderStatusFilter, intl: IntlShape) => {
  const { localized } = transformOrderStatus(status, intl);

  return localized;
};

const getAuthorizeStatusLabel = (status: OrderAuthorizeStatusEnum, intl: IntlShape) => {
  switch (status) {
    case "FULL":
      return intl.formatMessage(authorizeStatusMessages.full);
    case "PARTIAL":
      return intl.formatMessage(authorizeStatusMessages.partial);
    case "NONE":
      return intl.formatMessage(authorizeStatusMessages.none);
    default:
      return status;
  }
};

const getChargeStatusLabel = (status: OrderChargeStatusEnum, intl: IntlShape) => {
  switch (status) {
    case "FULL":
      return intl.formatMessage(chargeStatusMessages.full);
    case "PARTIAL":
      return intl.formatMessage(chargeStatusMessages.partial);
    case "OVERCHARGED":
      return intl.formatMessage(chargeStatusMessages.overcharged);
    case "NONE":
      return intl.formatMessage(chargeStatusMessages.none);
    default:
      return status;
  }
};

const getDiscountTypeLabel = (type: VoucherDiscountType, intl: IntlShape) => {
  switch (type) {
    case "FIXED":
      return intl.formatMessage(discountTypeMessages.fixed);
    case "PERCENTAGE":
      return intl.formatMessage(discountTypeMessages.percentage);
    case "SHIPPING":
      return intl.formatMessage(discountTypeMessages.shipping);
  }
};

const getVoucherStatusLabel = (status: DiscountStatusEnum, intl: IntlShape) => {
  switch (status) {
    case "ACTIVE":
      return intl.formatMessage(voucherStatusMessages.active);
    case "EXPIRED":
      return intl.formatMessage(voucherStatusMessages.expired);
    case "SCHEDULED":
      return intl.formatMessage(voucherStatusMessages.scheduled);
    default:
      return status;
  }
};

const getPublishedLabel = (status: CollectionPublished, intl: IntlShape) => {
  switch (status) {
    case "PUBLISHED":
      return intl.formatMessage(collectionFilterMessages.published);
    case "HIDDEN":
      return intl.formatMessage(collectionFilterMessages.hidden);
    default:
      return status;
  }
};

const getProductTypeLabel = (type: ProductTypeEnum, intl: IntlShape) => {
  switch (type) {
    case "DIGITAL":
      return intl.formatMessage(productTypeMessages.digital);
    case "SHIPPABLE":
      return intl.formatMessage(productTypeMessages.shippable);
    default:
      return type;
  }
};

const getStaffMemberStatusLabel = (status: StaffMemberStatus, intl: IntlShape) => {
  switch (status) {
    case "ACTIVE":
      return intl.formatMessage(staffMembersStatusMessages.active);
    case "DEACTIVATED":
      return intl.formatMessage(staffMembersStatusMessages.deactivated);
    default:
      return status;
  }
};

const getAttributeTypeLabel = (type: AttributeTypeEnum, intl: IntlShape) => {
  switch (type) {
    case "PAGE_TYPE":
      return intl.formatMessage(attributeTypesMessages.pageType);
    case "PRODUCT_TYPE":
      return intl.formatMessage(attributeTypesMessages.productType);
    default:
      return type;
  }
};

const getPaymentMethodTypeLabel = (type: PaymentMethodTypeEnum, intl: IntlShape) => {
  switch (type) {
    case "CARD":
      return intl.formatMessage(paymentMethodTypeMessages.card);
    case "OTHER":
      return intl.formatMessage(paymentMethodTypeMessages.other);
    default:
      return type;
  }
};

const getFulfillmentStatusLabel = (status: FulfillmentStatus, intl: IntlShape) => {
  switch (status) {
    case "CANCELED":
      return intl.formatMessage(fulfillmentStatusMessages.canceled);
    case "FULFILLED":
      return intl.formatMessage(fulfillmentStatusMessages.fulfilled);
    case "REFUNDED":
      return intl.formatMessage(fulfillmentStatusMessages.refunded);
    case "REFUNDED_AND_RETURNED":
      return intl.formatMessage(fulfillmentStatusMessages.refundedAndReturned);
    case "REPLACED":
      return intl.formatMessage(fulfillmentStatusMessages.replaced);
    case "RETURNED":
      return intl.formatMessage(fulfillmentStatusMessages.returned);
    case "WAITING_FOR_APPROVAL":
      return intl.formatMessage(fulfillmentStatusMessages.waitingForApproval);
    default:
      return status;
  }
};

export const getLocalizedLabel = (rowType: LeftOperand["type"], value: string, intl: IntlShape) => {
  switch (rowType) {
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
    case "typeOfProduct":
      return getProductTypeLabel(value as ProductTypeEnum, intl);
    case "staffMemberStatus":
      return getStaffMemberStatusLabel(value as StaffMemberStatus, intl);
    case "attributeType":
      return getAttributeTypeLabel(value as AttributeTypeEnum, intl);
    case "transactionsPaymentType":
      return getPaymentMethodTypeLabel(value as PaymentMethodTypeEnum, intl);
    case "fulfillmentStatus":
      return getFulfillmentStatusLabel(value as FulfillmentStatus, intl);
    default:
      return value;
  }
};
